const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js') 
const knexConex = knex(knexConfig.development)

const selectHistoricoByIdUsuario = async function(idUsuario) {
    try {
        let sql = `SELECT * FROM vwHistoricoUsuario WHERE id_usuario = ? ORDER BY data_evento DESC;`
        
        let result = await knexConex.raw(sql, [Number(idUsuario)])

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