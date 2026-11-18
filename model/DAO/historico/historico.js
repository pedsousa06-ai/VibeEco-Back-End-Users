const knex = require('knex')
// O caminho correto baseado na sua imagem: sobe de historico, sobe de DAO, e entra em database_config_knex
const knexConfig = require('../../database_config_knex/knex_file.js') 
const knexConex = knex(knexConfig.development)

const selectHistoricoByIdUsuario = async function(idUsuario) {
    try {
        let sql = `SELECT * FROM vwHistoricoUsuario WHERE id_usuario = ${idUsuario} ORDER BY data_evento DESC;`
        let result = await knexConex.raw(sql)

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

module.exports = {
    selectHistoricoByIdUsuario
}