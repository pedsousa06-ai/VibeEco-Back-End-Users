/*****************************************************************************
 * Objetivo: Regras da tela de Perfil do usuário
 *   GET /perfil/:id  -> dados, desempenho (7 dias, 30 dias, todo período),
 *                       evolução de XP (12 semanas) e conquistas
 *   PUT /perfil/:id  -> edição de nome, nome público, curso, localização e bio
 ****************************************************************************/
const config_message = require('../modulo/configMessages.js')
const perfilDAO = require('../../model/DAO/perfil/perfil.js')

const PERIODOS = { '7': 7, '30': 30, todo: null }
const SEMANAS = 12
const LIMITES = { nome: 100, nomePublico: 50, curso: 100, localizacao: 100, bio: 160 }

const idValido = (id) => /^\d+$/.test(String(id)) && Number(id) > 0

// texto vazio vira null; o resto é aparado
const textoOuNulo = (v) => {
    if (v === undefined || v === null) return null
    const t = String(v).trim()
    return t === '' ? null : t
}

// Posição de cada valor a partir da linha do banco (mysql2 devolve SUM como string)
const num = (v) => Number(v) || 0

async function buscarPerfil(id) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        if (!idValido(id)) return message.ERROR_BAD_REQUEST //400

        const usuarios = await perfilDAO.selectPerfilById(id)
        if (usuarios === false) return message.ERROR_INTERNAL_SERVER_MODEL //500
        if (usuarios.length === 0) return message.ERROR_NOT_FOUND //404
        const u = usuarios[0]

        const chaves = Object.keys(PERIODOS)
        const [ganhos, semanas, ranking, conquistas] = await Promise.all([
            Promise.all(chaves.map((k) => perfilDAO.selectGanhosPeriodo(id, PERIODOS[k]))),
            perfilDAO.selectXpPorSemana(id),
            perfilDAO.selectPosicaoRanking(id),
            perfilDAO.selectConquistasComSituacao(id),
        ])
        if (ganhos.includes(false) || semanas === false || ranking === false || conquistas === false) {
            return message.ERROR_INTERNAL_SERVER_MODEL //500
        }

        const desempenho = {}
        chaves.forEach((k, i) => {
            const g = ganhos[i][0] ?? {}
            desempenho[k] = { xp_ganho: num(g.xp), mc_ganho: num(g.mc), missoes_concluidas: num(g.missoes) }
        })

        // 12 posições, da mais antiga para a semana atual
        const evolucao = Array.from({ length: SEMANAS }, (_, i) => ({ semana: i + 1, xp: 0 }))
        for (const s of semanas) {
            const pos = SEMANAS - 1 - num(s.semana_atras)
            if (pos >= 0 && pos < SEMANAS) evolucao[pos].xp = num(s.xp)
        }

        const r = ranking[0] ?? {}
        const lista = conquistas.map((c) => ({
            id: c.id,
            nome: c.nome,
            descricao: c.descricao ?? '',
            img: c.img ?? null,
            desbloqueada: c.data_conquista !== null && c.data_conquista !== undefined,
            data_conquista: c.data_conquista ?? null,
        }))

        message.DEFAULT_MESSAGE.status = true
        message.DEFAULT_MESSAGE.status_code = 200
        message.DEFAULT_MESSAGE.response.perfil = {
            usuario: {
                id: u.id,
                nome: u.nome,
                nome_publico: u.nome_publico ?? '',
                email: u.email,
                matricula: u.matricula ?? '',
                curso: u.curso ?? '',
                localizacao: u.localizacao ?? '',
                bio: u.bio ?? '',
                foto: u.foto ?? '',
                instituicao: u.instituicao ?? '',
                escolaridade: u.escolaridade ?? '',
                nome_level: u.nome_level ?? '',
                numero_level: u.numero_level ?? null,
                xp: num(u.total_xp),
                xp_proximo_level: u.xp_proximo_level ?? null,
                coins: num(u.coins),
                data_cadastro: u.data_cadastro ?? null,
            },
            desempenho,
            ranking: { posicao: num(r.posicao) || null, total: num(r.total), aparece: !!r.aparece },
            evolucao_xp: evolucao,
            conquistas: {
                total: lista.length,
                desbloqueadas: lista.filter((c) => c.desbloqueada).length,
                lista,
            },
        }
        return message.DEFAULT_MESSAGE //200
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

// Valida e normaliza o corpo; devolve { dados } ou { erro }
function validarEdicao(corpo) {
    if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return { erro: 'Corpo inválido.' }
    const dados = {}
    for (const campo of Object.keys(LIMITES)) {
        const v = corpo[campo]
        if (v !== undefined && v !== null && typeof v !== 'string') return { erro: `${campo} deve ser texto.` }
        dados[campo] = textoOuNulo(v)
        if (dados[campo] !== null && dados[campo].length > LIMITES[campo]) {
            return { erro: `${campo} aceita no máximo ${LIMITES[campo]} caracteres.` }
        }
    }
    if (dados.nome === null) return { erro: 'O nome é obrigatório.' }
    return { dados }
}

async function atualizarPerfil(id, corpo, contentType) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        if (String(contentType).toUpperCase().split(';')[0].trim() !== 'APPLICATION/JSON') {
            return message.ERROR_CONTENT_TYPE //415
        }
        if (!idValido(id)) return message.ERROR_BAD_REQUEST //400

        const { dados, erro } = validarEdicao(corpo)
        if (erro) {
            message.ERROR_BAD_REQUEST.message = erro
            return message.ERROR_BAD_REQUEST //400
        }

        const existe = await perfilDAO.selectPerfilById(id)
        if (existe === false) return message.ERROR_INTERNAL_SERVER_MODEL //500
        if (existe.length === 0) return message.ERROR_NOT_FOUND //404

        if (!(await perfilDAO.updatePerfil(id, dados))) return message.ERROR_INTERNAL_SERVER_MODEL //500

        message.DEFAULT_MESSAGE.status = message.SUCCESS_UPDATE_ITEM.status
        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
        message.DEFAULT_MESSAGE.message = message.SUCCESS_UPDATE_ITEM.message
        message.DEFAULT_MESSAGE.response = {
            nome: dados.nome,
            nome_publico: dados.nomePublico ?? '',
            curso: dados.curso ?? '',
            localizacao: dados.localizacao ?? '',
            bio: dados.bio ?? '',
        }
        return message.DEFAULT_MESSAGE //200
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = { buscarPerfil, atualizarPerfil }
