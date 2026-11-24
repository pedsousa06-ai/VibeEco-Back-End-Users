
const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')

const knexConex = knex(knexConfig.development)

// Inserir participação em uma missão
const insertUsuarioMissao = async function (usuario_missao) {
    try {
        const sql = `
            INSERT INTO tbl_usuario_missao
                (id_usuario, id_missao, status, progresso)
            VALUES (?, ?, 'EM_ANDAMENTO', 0)
        `

        const result = await knexConex.raw(sql, [
            usuario_missao.id_usuario,
            usuario_missao.id_missao
        ])

        return result[0].insertId || false

    } catch (error) {
        console.log('Erro ao inserir participação:', error)
        return false
    }
}

// Buscar participações pelo ID da missão
const selectUsuarioMissaoByIdMissao = async function (id_missao) {
    try {
        const sql = `CALL procListarMissaoIdMissao(?)`
        const result = await knexConex.raw(sql, [id_missao])

        if (Array.isArray(result)) {
            return result[0][0]
        }

        return false

    } catch (error) {
        console.log('Erro ao buscar participações por missão:', error)
        return false
    }
}

// Buscar participações pelo ID do usuário
const selectUsuarioMissaoByIdUsuario = async function (id_usuario) {
    try {
        const sql = `CALL procListarMissaoIdUsuario(?)`
        const result = await knexConex.raw(sql, [id_usuario])

        if (Array.isArray(result)) {
            return result[0][0]
        }

        return false

    } catch (error) {
        console.log('Erro ao buscar participações por usuário:', error)
        return false
    }
}

// Buscar participação pelo ID do registro
const selectByIdUsuarioMissao = async function (id) {
    try {
        const sql = `CALL procListarMissaoUsuarioMissao(?)`
        const result = await knexConex.raw(sql, [id])

        if (Array.isArray(result)) {
            return result[0][0]
        }

        return false

    } catch (error) {
        console.log('Erro ao buscar participação:', error)
        return false
    }
}

// Buscar participação por missão e usuário
const selectByIdUsuarioByIdMissao = async function (id_missao, id_usuario) {
    try {
        const sql = `CALL procListarMissaoIdMissaoIdUsuario(?, ?)`

        const result = await knexConex.raw(sql, [
            id_missao,
            id_usuario
        ])

        if (Array.isArray(result)) {
            return result[0][0]
        }

        return false

    } catch (error) {
        console.log('Erro ao buscar participação específica:', error)
        return false
    }
}

// Excluir participação
const deleteUsuarioMissao = async function (id) {
    try {
        const sql = `
            DELETE FROM tbl_usuario_missao
            WHERE id = ?
        `

        const result = await knexConex.raw(sql, [id])

        return result[0].affectedRows > 0

    } catch (error) {
        console.log('Erro ao excluir participação:', error)
        return false
    }
}

module.exports = {
    insertUsuarioMissao,
    selectByIdUsuarioMissao,
    selectUsuarioMissaoByIdMissao,
    selectUsuarioMissaoByIdUsuario,
    selectByIdUsuarioByIdMissao,
    deleteUsuarioMissao
}
