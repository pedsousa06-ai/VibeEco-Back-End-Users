/*******************************************************************************************
 * Objetivo: JWT (HS256) do usuário, usando só o módulo "crypto" nativo do Node.
 * O payload leva { sub: id do usuário, tipo: "acesso" | "redefinicao", iat, exp }.
 * Segredo: JWT_SECRET no .env (sem ele usa um segredo de desenvolvimento e avisa no console).
 *******************************************************************************************/
const crypto = require('crypto')

const SEGREDO_PADRAO = 'vibeeco-segredo-somente-desenvolvimento'
const SEGREDO = process.env.JWT_SECRET || SEGREDO_PADRAO
if (!process.env.JWT_SECRET) {
    console.warn('[VIBEECO] JWT_SECRET não definido no .env: usando segredo de desenvolvimento. Defina um segredo próprio.')
}

const EXPIRA_ACESSO = Number(process.env.JWT_EXPIRES_IN) || 10800 // 3 horas (segundos)
const EXPIRA_REDEFINICAO = 15 * 60                                   // 15 minutos

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
const assinar = (dado) => crypto.createHmac('sha256', SEGREDO).update(dado).digest('base64url')

const gerarToken = function (idUsuario, tipo = 'acesso') {
    const agora = Math.floor(Date.now() / 1000)
    const duracao = tipo === 'redefinicao' ? EXPIRA_REDEFINICAO : EXPIRA_ACESSO
    const corpo = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: Number(idUsuario), tipo, iat: agora, exp: agora + duracao })}`
    return `${corpo}.${assinar(corpo)}`
}

// devolve o payload ou lança Error se a assinatura, o tipo ou a validade estiverem errados
const verificarToken = function (token, tipo = 'acesso') {
    if (typeof token !== 'string') throw new Error('Token não informado.')
    const partes = token.split('.')
    if (partes.length !== 3) throw new Error('Token inválido.')

    const esperado = Buffer.from(assinar(`${partes[0]}.${partes[1]}`))
    const recebido = Buffer.from(partes[2])
    if (esperado.length !== recebido.length || !crypto.timingSafeEqual(esperado, recebido)) throw new Error('Token inválido.')

    let dados
    try { dados = JSON.parse(Buffer.from(partes[1], 'base64url').toString('utf8')) } catch { throw new Error('Token inválido.') }

    if (dados.tipo !== tipo) throw new Error('Token de tipo errado.')
    if (!dados.exp || dados.exp <= Math.floor(Date.now() / 1000)) throw new Error('Token expirado.')
    return dados
}

module.exports = { gerarToken, verificarToken, EXPIRA_ACESSO }
