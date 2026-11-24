
const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')

const knexConex = knex(knexConfig.development)

// Inserir participação em uma missão
const insertUsuarioConteudoEducativo = async function (usuario_conteudo_educativo) {
    try {
        const sql = `
            INSERT INTO tbl_usuario_conteudo_educativo
                (id_usuario, id_missao, status, progresso)
            VALUES (?, ?, 'EM_ANDAMENTO', 0)
        `

        const result = await knexConex.raw(sql, [
            usuario_conteudo_educativo.id_usuario,
            usuario_conteudo_educativo.id_missao
        ])

        return result[0].insertId || false

    } catch (error) {
        console.log('Erro ao inserir participação:', error)
        return false
    }
}

// Buscar participações pelo ID da missão
const selectUsuarioConteudoEducatiboByIdConteudoEducativo = async function (id_missao) {
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
const selectUsuarioConteudoEducativoByIdUsuario = async function (id_usuario) {
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
const selectByIdUsuarioConteudoEducativo = async function (id) {
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
const selectByIdUsuarioByIdConteudoEducativo = async function (id_missao, id_usuario) {
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
const deleteUsuarioConteudoEducativo = async function (id) {
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
    insertUsuarioConteudoEducativo,
    selectUsuarioConteudoEducatiboByIdConteudoEducativo,
    selectUsuarioConteudoEducativoByIdUsuario,
    selectByIdUsuarioConteudoEducativo,
    selectByIdUsuarioByIdConteudoEducativo,
    deleteUsuarioConteudoEducativo
}

// // Buscar conteúdo educativo pelo ID e registrar acesso do usuário
// const selectConteudoEducativoById = async function (id, idUsuario) {
//     try {
//         // Registrar acesso do usuário
//         await knexConex.raw(`
//             INSERT INTO tbl_usuario_conteudo_educativo
//                 (id_usuario, id_conteudo_educativo)
//             VALUES (?, ?)
//             ON DUPLICATE KEY UPDATE
//                 data_acesso = CURRENT_TIMESTAMP
//         `, [idUsuario, id])

//         const result = await knexConex("tbl_conteudo_educativo as ce")
//             .select(
//                 "ce.id",
//                 "ce.nome",
//                 "ce.descricao",
//                 "ce.img",
//                 "ce.qtde_xp",
//                 "ce.duracao_leitura"
//             )
//             .select(
//                 knexConex.raw(`
//                     COALESCE((
//                         SELECT GROUP_CONCAT(c.nome SEPARATOR ', ')
//                         FROM tbl_conteudo_educativo_categoria cec
//                         INNER JOIN tbl_categoria c
//                             ON c.id = cec.id_categoria
//                         WHERE cec.id_conteudo_educativo = ce.id
//                     ), 'Sem categoria') AS categoria
//                 `)
//             )
//             .select(
//                 knexConex.raw(`
//                     COALESCE((
//                         SELECT uce.concluido
//                         FROM tbl_usuario_conteudo_educativo uce
//                         WHERE uce.id_conteudo_educativo = ce.id
//                         AND uce.id_usuario = ?
//                         LIMIT 1
//                     ), 0) AS concluido
//                 `, [idUsuario])
//             )
//             .where("ce.id", id)
//             .first()

//         return result || false

//     } catch (error) {
//         console.log("Erro ao buscar conteúdo educativo:", error)
//         return false
//     }
// }

// // Concluir leitura e entregar XP somente uma vez
// const concluirConteudoEducativo = async function (
//     idUsuario,
//     idConteudo,
//     tempoAcesso
// ) {
//     try {
//         return await knexConex.transaction(async function (trx) {

//             // Verificar se o conteúdo existe
//             const conteudo = await trx("tbl_conteudo_educativo")
//                 .select("id", "qtde_xp")
//                 .where("id", idConteudo)
//                 .first()

//             if (!conteudo) {
//                 return false
//             }

//             // Verificar se o usuário existe
//             const usuario = await trx("tbl_usuario")
//                 .select("id")
//                 .where("id", idUsuario)
//                 .first()

//             if (!usuario) {
//                 return false
//             }

//             // Garantir um único registro de progresso
//             await trx.raw(`
//                 INSERT INTO tbl_usuario_conteudo_educativo
//                     (id_usuario, id_conteudo_educativo)
//                 VALUES (?, ?)
//                 ON DUPLICATE KEY UPDATE
//                     id = LAST_INSERT_ID(id)
//             `, [idUsuario, idConteudo])

//             // Bloquear registro durante a transação
//             const progresso = await trx("tbl_usuario_conteudo_educativo")
//                 .select("id", "concluido")
//                 .where({
//                     id_usuario: idUsuario,
//                     id_conteudo_educativo: idConteudo
//                 })
//                 .forUpdate()
//                 .first()

//             if (!progresso) {
//                 throw new Error(
//                     "Não foi possível localizar o progresso do usuário."
//                 )
//             }

//             // Se já concluiu, não entregar XP novamente
//             if (Boolean(progresso.concluido)) {
//                 return {
//                     jaConcluido: true,
//                     xpGanho: 0,
//                     concluido: true
//                 }
//             }

//             const xp = Number(conteudo.qtde_xp) || 0
//             const tempo = Math.max(0, Number(tempoAcesso) || 0)

//             // Atualizar progresso
//             await trx("tbl_usuario_conteudo_educativo")
//                 .where("id", progresso.id)
//                 .update({
//                     concluido: true,
//                     data_acesso: trx.fn.now(),
//                     tempo_acesso: tempo
//                 })

//             // Adicionar XP ao usuário
//             await trx("tbl_usuario")
//                 .where("id", idUsuario)
//                 .increment("total_xp", xp)

//             return {
//                 jaConcluido: false,
//                 xpGanho: xp,
//                 concluido: true
//             }
//         })

//     } catch (error) {
//         console.log("Erro ao concluir conteúdo educativo:", error)
//         return false
//     }
// }

// // Listar conteúdos educativos com categoria e progresso do usuário
// const selectTodosConteudosEducativos = async function (idUsuario) {
//     try {
//         const result = await knexConex("tbl_conteudo_educativo as ce")
//             .select(
//                 "ce.id",
//                 "ce.nome",
//                 "ce.descricao",
//                 "ce.img",
//                 "ce.qtde_xp",
//                 "ce.duracao_leitura"
//             )
//             .select(
//                 knexConex.raw(`
//                     COALESCE((
//                         SELECT GROUP_CONCAT(c.nome SEPARATOR ', ')
//                         FROM tbl_conteudo_educativo_categoria cec
//                         INNER JOIN tbl_categoria c
//                             ON c.id = cec.id_categoria
//                         WHERE cec.id_conteudo_educativo = ce.id
//                     ), 'Sem categoria') AS categoria
//                 `)
//             )
//             .select(
//                 knexConex.raw(`
//                     COALESCE((
//                         SELECT uce.concluido
//                         FROM tbl_usuario_conteudo_educativo uce
//                         WHERE uce.id_conteudo_educativo = ce.id
//                         AND uce.id_usuario = ?
//                         LIMIT 1
//                     ), 0) AS concluido
//                 `, [idUsuario])
//             )
//             .orderBy("ce.id", "asc")

//         return result

//     } catch (error) {
//         console.log("Erro ao listar conteúdos educativos:", error)
//         return false
//     }
// }

// // Exportar funções utilizadas pelo controller
// module.exports = {
//     selectConteudoEducativoById,
//     concluirConteudoEducativo,
//     selectTodosConteudosEducativos
// }
