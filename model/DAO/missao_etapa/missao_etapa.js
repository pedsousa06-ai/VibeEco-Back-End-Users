/*******************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela missao_etapa
 *******************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')
const knexConex = knex(knexConfig.development)

// Busca as etapas de uma missão específica
const selectMissaoEtapaByIdMissao = async function (id_missao) {
    try {
        let sql = `
            SELECT id, id_missao, titulo, xp, ordem 
            FROM tbl_missao_etapa 
            WHERE id_missao = ? 
            ORDER BY ordem ASC
        `
        let result = await knexConex.raw(sql, [id_missao])
        
        if (Array.isArray(result)) {
            return result[0] // Retorna o array de linhas
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

// Busca uma etapa específica pelo ID
const selectByIdMissaoEtapa = async function (id_etapa) {
    try {
        let sql = `SELECT * FROM tbl_missao_etapa WHERE id = ?`
        let result = await knexConex.raw(sql, [id_etapa])
        
        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = { selectMissaoEtapaByIdMissao, selectByIdMissaoEtapa }