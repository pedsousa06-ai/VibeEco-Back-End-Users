/*******************************************************************************************************
 * Objetivo: Consultas da tela de Perfil do usuário
 *******************************************************************************************************/
const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')
const knexConex = knex(knexConfig.development)

const linhas = (result) => (Array.isArray(result) ? result[0] : false)

// Dados do usuário
const selectPerfilById = async function (id) {
    try {
        const sql = `
            SELECT u.id, u.nome, u.nome_publico, u.email, u.matricula, u.curso, u.localizacao, u.bio,
                   u.foto, u.total_xp, u.coins, u.data_cadastro, u.exibir_ranking,
                   l.nome AS nome_level, l.numero_level,
                   prox.nome AS nome_proximo_level, prox.xp_necessario AS xp_proximo_level,
                   i.nome AS instituicao, e.nome AS escolaridade
            FROM tbl_usuario u
            LEFT JOIN tbl_level_user l ON l.id = u.id_level
            LEFT JOIN tbl_level_user prox ON prox.numero_level = l.numero_level + 1
            LEFT JOIN tbl_instituicao i ON i.id = u.id_instituicao
            LEFT JOIN tbl_escolaridade e ON e.id = u.id_escolaridade
            WHERE u.id = ?`
        return linhas(await knexConex.raw(sql, [Number(id)]))
    } catch (error) {
        console.log(error)
        return false
    }
}

// XP e moedas
const selectGanhosPeriodo = async function (id, dias) {
    try {
        const filtro = dias === null ? '' : `AND data_evento >= DATE_SUB(NOW(), INTERVAL ${Number(dias)} DAY)`
        const sql = `
            SELECT COALESCE(SUM(xp), 0) AS xp,
                   COALESCE(SUM(CASE WHEN mc > 0 THEN mc ELSE 0 END), 0) AS mc,
                   COALESCE(SUM(tipo = 'missao'), 0) AS missoes
            FROM vwHistoricoUsuario
            WHERE id_usuario = ? 
              AND data_evento IS NOT NULL 
              AND data_evento <= NOW() ${filtro}`
        return linhas(await knexConex.raw(sql, [Number(id)]))
    } catch (error) {
        console.log(error)
        return false
    }
}

// XP por semana
const selectXpPorSemana = async function (id) {
    try {
        const sql = `
            SELECT FLOOR(DATEDIFF(CURDATE(), DATE(data_evento)) / 7) AS semana_atras,
                   COALESCE(SUM(xp), 0) AS xp
            FROM vwHistoricoUsuario
            WHERE id_usuario = ? 
              AND data_evento IS NOT NULL
              AND data_evento <= NOW() AND data_evento >= DATE_SUB(CURDATE(), INTERVAL 83 DAY)
            GROUP BY semana_atras`
        return linhas(await knexConex.raw(sql, [Number(id)]))
    } catch (error) {
        console.log(error)
        return false
    }
}

// Posição no ranking
const selectPosicaoRanking = async function (id) {
    try {
        const sql = `
            SELECT
                (SELECT COUNT(*) FROM tbl_usuario o
                  WHERE o.exibir_ranking = TRUE AND o.total_xp > me.total_xp) + 1 AS posicao,
                (SELECT COUNT(*) FROM tbl_usuario WHERE exibir_ranking = TRUE) AS total,
                me.exibir_ranking AS aparece
            FROM tbl_usuario me WHERE me.id = ?`
        return linhas(await knexConex.raw(sql, [Number(id)]))
    } catch (error) {
        console.log(error)
        return false
    }
}

// Conquistas
const selectConquistasComSituacao = async function (id) {
    try {
        const sql = `
            SELECT c.id, c.nome, c.descricao, c.img, MAX(uc.data_conquista) AS data_conquista
            FROM tbl_conquista c
            LEFT JOIN tbl_usuario_conquista uc ON uc.id_conquista = c.id AND uc.id_usuario = ?
            GROUP BY c.id, c.nome, c.descricao, c.img
            ORDER BY (MAX(uc.data_conquista) IS NULL), MAX(uc.data_conquista) DESC, c.id`
        return linhas(await knexConex.raw(sql, [Number(id)]))
    } catch (error) {
        console.log(error)
        return false
    }
}

// Atualiza o perfil
const updatePerfil = async function (id, d) {
    try {
        const sql = `UPDATE tbl_usuario
                     SET nome = ?, nome_publico = ?, curso = ?, localizacao = ?, bio = ?
                     WHERE id = ?`
        await knexConex.raw(sql, [d.nome, d.nomePublico, d.curso, d.localizacao, d.bio, Number(id)])
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    selectPerfilById, selectGanhosPeriodo, selectXpPorSemana,
    selectPosicaoRanking, selectConquistasComSituacao, updatePerfil
}