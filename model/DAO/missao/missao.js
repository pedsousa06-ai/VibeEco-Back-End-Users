
const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')

const knexConex = knex(knexConfig.development)

// =========================================================
// LISTAR TODAS AS MISSÕES
// =========================================================

const selectAllMissao = async function (id_usuario) {
    try {

        // Diagnóstico da conexão
        const diagnostico = await knexConex.raw(`
            SELECT
                DATABASE() AS banco,
                @@hostname AS servidor,
                @@port AS porta,
                @@version AS versao
        `)

        // Verificar tabelas existentes
        const tabelas = await knexConex.raw(`
            SELECT
                TABLE_SCHEMA,
                TABLE_NAME,
                TABLE_TYPE
            FROM information_schema.TABLES
            WHERE TABLE_NAME = 'tbl_missao'
        `)

        // Verificar missões
        const dados = await knexConex.raw(`
            SELECT id, nome, id_dificuldade
            FROM db_vibeEco_2026.tbl_missao
            ORDER BY id
        `)

        const contagem = await knexConex.raw(`
            SELECT
                COUNT(*) AS total_missoes,
                MAX(id) AS maior_id
            FROM db_vibeEco_2026.tbl_missao
        `)

        const testeMissao4 = await knexConex.raw(`
    SELECT id, nome
    FROM db_vibeEco_2026.tbl_missao
    WHERE id = 4
`)

console.log('========== TESTE MISSÃO 4 NO NODE ==========')
console.log(testeMissao4[0])
console.log('============================================')

        console.log('\n========== DIAGNÓSTICO NODE ==========')
        console.log('Conexão:', diagnostico[0])
        console.log('Tabelas encontradas:', tabelas[0])
        console.log('Missões pelo nome completo:', dados[0])
        console.log('Quantidade e maior ID:', contagem[0])
        console.log('======================================\n')


                const diagnosticoServidor = await knexConex.raw(`
                SELECT
                @@hostname AS servidor,
                @@port AS porta,
                @@server_uuid AS server_uuid,
                @@server_id AS server_id,
                @@datadir AS diretorio_dados,
                CURRENT_USER() AS usuario
        `)

        console.log('========== SERVIDOR MYSQL DO NODE ==========')
        console.log(diagnosticoServidor[0])
        console.log('============================================')
        // Consulta principal
        const sql = `
            SELECT
                m.id AS id_missao,
                m.nome AS nome_missao,
                m.descricao AS descricao_missao,
                m.total_xp_missao AS xp_missao,
                m.coins AS coins_missao,
                m.id_dificuldade AS dificuldade_missao,
                d.nome AS nome_dificuldade,
                GREATEST(DATEDIFF(m.data_termino, CURDATE()), 0) AS prazo_dias,
                um.id_usuario AS id_usuario,
                um.status AS status_missao,
                COALESCE(um.progresso, 0) AS progresso_missao
            FROM db_vibeEco_2026.tbl_missao m
            INNER JOIN db_vibeEco_2026.tbl_dificuldade d
                ON d.id = m.id_dificuldade
            LEFT JOIN db_vibeEco_2026.tbl_usuario_missao um
                ON um.id_missao = m.id
                AND um.id_usuario = ?
            ORDER BY m.data_termino DESC
        `

        const result = await knexConex.raw(sql, [id_usuario])

        console.log('\n========== DAO: TODAS AS MISSÕES ==========')
        console.log('Banco:', knexConfig.development.connection.database)
        console.log('Usuário:', id_usuario)
        console.log('Quantidade retornada:', result[0].length)
        console.log('IDs:', result[0].map(m => m.id_missao))
        console.log('============================================\n')

        return result[0] || []

    } catch (error) {
        console.error('Erro ao listar todas as missões:', error)
        return false
    }
}

// =========================================================
// LISTAR MISSÕES DISPONÍVEIS
// =========================================================

const selectAllMissaoDisponivel = async function (id_usuario) {
    try {
        const sql = `
            SELECT
                m.id AS id_missao,
                m.nome AS nome_missao,
                m.descricao AS descricao_missao,
                m.total_xp_missao AS xp_missao,
                m.coins AS coins_missao,
                m.id_dificuldade AS dificuldade_missao,
                d.nome AS nome_dificuldade,
                GREATEST(DATEDIFF(m.data_termino, CURDATE()), 0) AS prazo_dias,
                um.id_usuario AS id_usuario,
                um.status AS status_missao,
                COALESCE(um.progresso, 0) AS progresso_missao
            FROM db_vibeEco_2026.tbl_missao m
            INNER JOIN db_vibeEco_2026.tbl_dificuldade d
                ON d.id = m.id_dificuldade
            LEFT JOIN db_vibeEco_2026.tbl_usuario_missao um
                ON um.id_missao = m.id
                AND um.id_usuario = ?
            WHERE m.data_termino >= CURDATE()
              AND (
                    um.status IS NULL
                    OR um.status = 'CANCELADA'
              )
            ORDER BY m.data_termino DESC
        `

        const result = await knexConex.raw(sql, [id_usuario])
        console.log('Missões disponíveis:', result[0].length)
        return result[0] || []

    } catch (error) {
        console.error('Erro ao listar missões disponíveis:', error)
        return false
    }
}

// =========================================================
// LISTAR MISSÕES EM ANDAMENTO
// =========================================================

const selectAllMissaoAndamento = async function (id_usuario) {
    try {
        const sql = `
            SELECT
                m.id AS id_missao,
                m.nome AS nome_missao,
                m.descricao AS descricao_missao,
                m.total_xp_missao AS xp_missao,
                m.coins AS coins_missao,
                m.id_dificuldade AS dificuldade_missao,
                d.nome AS nome_dificuldade,
                GREATEST(DATEDIFF(m.data_termino, CURDATE()), 0) AS prazo_dias,
                um.id_usuario AS id_usuario,
                um.status AS status_missao,
                COALESCE(um.progresso, 0) AS progresso_missao
            FROM db_vibeEco_2026.tbl_missao m
            INNER JOIN db_vibeEco_2026.tbl_usuario_missao um
                ON um.id_missao = m.id
            INNER JOIN db_vibeEco_2026.tbl_dificuldade d
                ON d.id = m.id_dificuldade
            WHERE um.id_usuario = ?
              AND um.status = 'EM_ANDAMENTO'
            ORDER BY m.data_termino DESC
        `

        const result = await knexConex.raw(sql, [id_usuario])
        console.log('Missões em andamento:', result[0].length)
        return result[0] || []

    } catch (error) {
        console.error('Erro ao listar missões em andamento:', error)
        return false
    }
}

// =========================================================
// LISTAR MISSÕES CONCLUÍDAS
// =========================================================

const selectAllMissaoConcluida = async function (id_usuario) {
    try {
        const sql = `
            SELECT
                m.id AS id_missao,
                m.nome AS nome_missao,
                m.descricao AS descricao_missao,
                m.total_xp_missao AS xp_missao,
                m.coins AS coins_missao,
                m.id_dificuldade AS dificuldade_missao,
                d.nome AS nome_dificuldade,
                GREATEST(DATEDIFF(m.data_termino, CURDATE()), 0) AS prazo_dias,
                um.id_usuario AS id_usuario,
                um.status AS status_missao,
                COALESCE(um.progresso, 0) AS progresso_missao
            FROM db_vibeEco_2026.tbl_missao m
            INNER JOIN db_vibeEco_2026.tbl_usuario_missao um
                ON um.id_missao = m.id
            INNER JOIN db_vibeEco_2026.tbl_dificuldade d
                ON d.id = m.id_dificuldade
            WHERE um.id_usuario = ?
              AND um.status = 'CONCLUIDA'
            ORDER BY m.data_termino DESC
        `

        const result = await knexConex.raw(sql, [id_usuario])
        console.log('Missões concluídas:', result[0].length)
        return result[0] || []

    } catch (error) {
        console.error('Erro ao listar missões concluídas:', error)
        return false
    }
}

// =========================================================
// EXPORTAÇÕES
// =========================================================

module.exports = {
    selectAllMissao,
    selectAllMissaoDisponivel,
    selectAllMissaoAndamento,
    selectAllMissaoConcluida
}
