<<<<<<< HEAD
/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * usuario_missao
 * Data: 12/11/2026
 * Autor: Riller
 * Versão: 1.0
 * 
 *******************************************************************************************************/

//Import da biblioteca para gerenciar o banco de dados MySql no node.js
const knex = require('knex')

//Import do arquivo de configuração para conexão com o banco de dados MySql
const knexConfig = require('../../database_config_knex/knex_file.js')

//Criar a conexão com o banco de dados MySql
const knexConex = knex(knexConfig.development)

//Select com critério de filtro o id do post
const selectMissaoEtapaByIdMissao = async function (id_missao) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarEtapasByIdMissao(${id_missao})`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Select com critério de filtro o id do post
const selectByIdMissaoEtapa = async function (id_etapa) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarMissaoEtapaById(${id_etapa})`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {selectMissaoEtapaByIdMissao, selectByIdMissaoEtapa}
=======

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
>>>>>>> 0b44ef41d2fc7586ae5e1e7f68eabf650fcc1566
