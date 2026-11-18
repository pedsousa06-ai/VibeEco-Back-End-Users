/***************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados
 * MySQL na tabela usuario_missao
 * Data: 18/11/2026
 * Autor: Riller
 * Versão: 1.0
 ***************************************************************/

// Import da biblioteca para gerenciar o banco de dados MySQL no Node.js
const knex = require('knex')

// Import do arquivo de configuração para conexão com o banco de dados MySQL
const knexConfig = require('../../database_config_knex/knex_file.js')

// Criar a conexão com o banco de dados MySQL
const knexConex = knex(knexConfig.development)

// Select com critério de filtro pelo id da categoria
const selectDesafioCategoriaByIdCategoria = async function (id) {
    try {
        // Buscar missões pelo id da categoria
        let result = await knexConex.raw(
            'call procListarDesafioIdCategoria(?)',
            [id]
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

// Read: buscar categoria pelo id da missão
const selectDesafioCategoriaByIdDesafio = async function (id) {
    try {
        // Buscar categoria pelo id da missão
        let result = await knexConex.raw(
            'call procListarCategoriaByIdDesafio(?)',
            [id]
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

module.exports = {
    selectDesafioCategoriaByIdCategoria,
    selectDesafioCategoriaByIdDesafio
}
