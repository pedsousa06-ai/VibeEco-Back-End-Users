
const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')

const knexConex = knex(knexConfig.development)

const selectNotificacoesByIdUsuario = async function(idUsuario) {
    try {
        const result = await knexConex.raw(
            'CALL procListarNotificacoes(?)',
            [idUsuario]
        )

        return result[0][0] || []

    } catch (error) {
        console.log('Erro ao listar notificações no DAO:', error)
        throw error
    }
}

const updateNotificacaoLida = async function(idNotificacao) {
    try {
        await knexConex.raw(
            'CALL procMarcarNotificacaoLida(?)',
            [idNotificacao]
        )

        return true

    } catch (error) {
        console.log('Erro ao marcar notificação como lida:', error)
        throw error
    }
}

const updateTodasNotificacoesLidas = async function(idUsuario) {
    try {
        await knexConex.raw(
            'CALL procMarcarTodasNotificacoesLidas(?)',
            [idUsuario]
        )

        return true

    } catch (error) {
        console.log('Erro ao marcar todas as notificações:', error)
        throw error
    }
}

module.exports = {
    selectNotificacoesByIdUsuario,
    updateNotificacaoLida,
    updateTodasNotificacoesLidas
}
