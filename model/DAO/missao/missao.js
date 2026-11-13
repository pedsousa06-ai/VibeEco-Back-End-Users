/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * Post
 * Data: 11/11/2026
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

//Read
const selectAllMissao = async function (id_usuario) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarTodasMissoes(${id_usuario});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read
const selectAllMissaoDisponivel = async function (id_usuario) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarTodasMissoesDisponiveis(${id_usuario});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read
const selectAllMissaoAndamento = async function (id_usuario) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarTodasMissoesAndamento(${id_usuario});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read
const selectAllMissaoConcluida = async function (id_usuario) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarTodasMissoesConcluidas(${id_usuario});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllMissao,
    selectAllMissaoDisponivel,
    selectAllMissaoAndamento,
    selectAllMissaoConcluida
}