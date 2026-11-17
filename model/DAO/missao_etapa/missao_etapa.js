
/***************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados
 * MySQL na tabela usuario_missao
 * Data: 12/11/2026
 * Autor: Riller
 * Versão: 1.0
 ***************************************************************/

// Import da biblioteca para gerenciar o banco de dados MySQL no Node.js
const knex = require('knex')

// Import do arquivo de configuração para conexão com o banco de dados MySQL
const knexConfig = require('../../database_config_knex/knex_file.js')

// Criar a conexão com o banco de dados MySQL
const knexConex = knex(knexConfig.development)

// Select com critério de filtro pelo id da missão
const selectMissaoEtapaByIdMissao = async function (id_missao) {
    try {
        // Buscar as etapas da missão utilizando parâmetro vinculado
        let result = await knexConex.raw(
            'call procListarEtapasByIdMissao(?)',
            [id_missao]
        )

        if (Array.isArray(result)) {
            return result[0][0]
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = { selectMissaoEtapaByIdMissao }