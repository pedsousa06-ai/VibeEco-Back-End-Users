/*******************************************************************************************
 * Objetivo: login (JWT), recuperação de senha por código e primeiro acesso do usuário
 * Fluxo da recuperação: recuperarAcesso (envia código) -> validarCodigo (devolve token curto)
 *                       -> redefinirSenha (usa esse token + nova senha)
 *******************************************************************************************/
const crypto = require('crypto')
const dao = require('../../model/DAO/autenticacao/autenticacao.js')
const senhaSvc = require('../../service/senha.js')
const limitador = require('../../service/limitador.js')
const { gerarToken, verificarToken, EXPIRA_ACESSO } = require('../../service/token.js')
const { enviarCodigoRecuperacao } = require('../../service/email.js')

const MAX_TENTATIVAS = 5

const resp = (status_code, message, extra = {}) => ({ status: status_code < 400, status_code, message, ...extra })
const ERRO_INTERNO = () => resp(500, 'Erro interno do servidor.', { codigo: 'ERRO_INTERNO' })
const texto = (v) => (typeof v === 'string' ? v.trim() : '')
const hashCodigo = (codigo) => crypto.createHash('sha256').update(String(codigo)).digest('hex')

// mesma regra das telas: 8+ caracteres, com letras e números
const validarNovaSenha = function (senha) {
    if (typeof senha !== 'string' || senha.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.'
    if (!/\p{L}/u.test(senha) || !/\d/.test(senha)) return 'Use letras e números na senha.'
    return ''
}

const dadosUsuario = (u) => ({ id: u.id, nome: u.nome, email: u.email, matricula: u.matricula ?? null })

// confere login + senha; devolve { erro } ou { usuario }
const conferirCredenciais = async function (login, senha) {
    const chave = `login:${login.toLowerCase()}`
    if (limitador.bloqueado(chave, MAX_TENTATIVAS)) return { erro: resp(429, 'Muitas tentativas. Aguarde alguns minutos.', { codigo: 'MUITAS_TENTATIVAS' }) }

    const usuario = await dao.buscarPorLogin(login)
    if (usuario === false) return { erro: ERRO_INTERNO() }

    if (!usuario || !senhaSvc.verificarSenha(senha, usuario.senha)) {
        limitador.registrarFalha(chave)
        return { erro: resp(401, 'E-mail, matrícula ou senha incorretos.', { codigo: 'CREDENCIAIS_INVALIDAS' }) }
    }
    if (!Number(usuario.ativo)) return { erro: resp(403, 'Usuário inativo.', { codigo: 'USUARIO_INATIVO' }) }

    limitador.limpar(chave)
    return { usuario }
}

const login = async function (dados) {
    try {
        const identificador = texto(dados?.login), senha = typeof dados?.senha === 'string' ? dados.senha : ''
        if (!identificador || !senha) return resp(400, 'Informe e-mail ou matrícula e a senha.', { codigo: 'DADOS_INVALIDOS' })

        const r = await conferirCredenciais(identificador, senha)
        if (r.erro) return r.erro

        // senha antiga em texto puro vira hash no primeiro login bem-sucedido
        if (!senhaSvc.ehHash(r.usuario.senha)) await dao.atualizarSenha(r.usuario.id, senhaSvc.gerarHash(senha))

        return resp(200, 'Login realizado com sucesso.', {
            response: { token: gerarToken(r.usuario.id), expira_em: EXPIRA_ACESSO, usuario: dadosUsuario(r.usuario) }
        })
    } catch (error) { console.log(error); return ERRO_INTERNO() }
}

const me = async function (idUsuario) {
    try {
        const usuario = await dao.buscarPorId(idUsuario)
        if (usuario === false) return ERRO_INTERNO()
        if (!usuario) return resp(404, 'Usuário não encontrado.', { codigo: 'USUARIO_NAO_ENCONTRADO' })
        return resp(200, 'OK', { response: { usuario: dadosUsuario(usuario) } })
    } catch (error) { console.log(error); return ERRO_INTERNO() }
}

// sempre responde 200, exista ou não o e-mail (não revela quem tem conta)
const recuperarAcesso = async function (dados) {
    try {
        const email = texto(dados?.email)
        if (!email || !email.includes('@')) return resp(400, 'Informe um e-mail válido.', { codigo: 'DADOS_INVALIDOS' })

        const chave = `recuperar:${email.toLowerCase()}`
        const genericos = resp(200, 'Se o e-mail estiver cadastrado, enviamos um código de 6 dígitos.')
        if (limitador.bloqueado(chave, 5)) return resp(429, 'Muitos pedidos de código. Aguarde alguns minutos.', { codigo: 'MUITAS_TENTATIVAS' })
        limitador.registrarFalha(chave) // conta cada pedido para limitar o reenvio

        const usuario = await dao.buscarPorLogin(email)
        if (usuario === false) return ERRO_INTERNO()
        if (!usuario || !Number(usuario.ativo) || usuario.email.toLowerCase() !== email.toLowerCase()) return genericos

        const codigo = String(crypto.randomInt(0, 1000000)).padStart(6, '0')
        if (!(await dao.salvarCodigo(usuario.id, hashCodigo(codigo)))) return ERRO_INTERNO()
        await enviarCodigoRecuperacao(usuario.email, codigo)

        // só para desenvolvimento (EXPOR_CODIGO_DEV=true no .env): devolve o código na resposta
        if (process.env.EXPOR_CODIGO_DEV === 'true') return { ...genericos, response: { codigo_dev: codigo } }
        return genericos
    } catch (error) { console.log(error); return ERRO_INTERNO() }
}

const validarCodigo = async function (dados) {
    try {
        const email = texto(dados?.email), codigo = texto(String(dados?.codigo ?? ''))
        if (!email || !/^\d{6}$/.test(codigo)) return resp(400, 'Informe o e-mail e o código de 6 dígitos.', { codigo: 'DADOS_INVALIDOS' })

        const chave = `codigo:${email.toLowerCase()}`
        if (limitador.bloqueado(chave, MAX_TENTATIVAS)) return resp(429, 'Muitas tentativas. Peça um novo código.', { codigo: 'MUITAS_TENTATIVAS' })

        const usuario = await dao.buscarPorLogin(email)
        if (usuario === false) return ERRO_INTERNO()
        const salvo = usuario ? await dao.buscarCodigo(usuario.id) : null
        if (salvo === false) return ERRO_INTERNO()

        const esperado = Buffer.from(salvo?.codigo_recuperacao ?? ''.padEnd(64, '0'))
        const recebido = Buffer.from(hashCodigo(codigo))
        const confere = !!salvo?.codigo_recuperacao && esperado.length === recebido.length && crypto.timingSafeEqual(esperado, recebido)

        if (!confere) {
            limitador.registrarFalha(chave)
            return resp(400, 'Código inválido.', { codigo: 'CODIGO_INVALIDO' })
        }
        if (!Number(salvo.valido)) return resp(400, 'Código expirado. Peça um novo.', { codigo: 'CODIGO_EXPIRADO' })

        await dao.limparCodigo(usuario.id) // código de uso único
        limitador.limpar(chave)
        return resp(200, 'Código confirmado.', { response: { token: gerarToken(usuario.id, 'redefinicao') } })
    } catch (error) { console.log(error); return ERRO_INTERNO() }
}

const redefinirSenha = async function (dados) {
    try {
        let payload
        try { payload = verificarToken(dados?.token, 'redefinicao') }
        catch { return resp(401, 'Link expirado. Refaça a recuperação de senha.', { codigo: 'TOKEN_INVALIDO' }) }

        const erro = validarNovaSenha(dados?.novaSenha)
        if (erro) return resp(400, erro, { codigo: 'SENHA_FRACA' })

        if (!(await dao.atualizarSenha(payload.sub, senhaSvc.gerarHash(dados.novaSenha)))) return ERRO_INTERNO()
        return resp(200, 'Senha alterada com sucesso.')
    } catch (error) { console.log(error); return ERRO_INTERNO() }
}

// tela "Primeiro acesso": troca a senha provisória (senhaAtual) por uma nova, sem estar logado
const primeiroAcesso = async function (dados) {
    try {
        const identificador = texto(dados?.login), atual = typeof dados?.senhaAtual === 'string' ? dados.senhaAtual : ''
        if (!identificador || !atual) return resp(400, 'Informe e-mail ou matrícula e a senha atual.', { codigo: 'DADOS_INVALIDOS' })

        const erro = validarNovaSenha(dados?.novaSenha)
        if (erro) return resp(400, erro, { codigo: 'SENHA_FRACA' })
        if (dados.novaSenha === atual) return resp(400, 'A nova senha precisa ser diferente da atual.', { codigo: 'SENHA_IGUAL' })

        const r = await conferirCredenciais(identificador, atual)
        if (r.erro) return r.erro

        if (!(await dao.atualizarSenha(r.usuario.id, senhaSvc.gerarHash(dados.novaSenha)))) return ERRO_INTERNO()
        return resp(200, 'Senha criada com sucesso.')
    } catch (error) { console.log(error); return ERRO_INTERNO() }
}

module.exports = { login, me, recuperarAcesso, validarCodigo, redefinirSenha, primeiroAcesso }
