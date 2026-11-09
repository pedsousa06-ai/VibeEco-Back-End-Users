/********************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo SELECT no Banco de dados MySQL na tabela de user
 * Data: 05/11/2026
 * Autor: Riller
 * Versão: 1.0.10.26
 ********************************************************************************************************************************************************************************************/

//importando a biblioteca para gerenciar o banco de dados no node.js
const knex = require("knex")

//importando o arquivo "database_config_knex" para atribuir as configurações do BD
const knexConfig = require("../../database_config_knex/knex_file.js")

//criando a conexão por meio do arquivo que contém os dados necessários para estabelecer o acesso e a conexão
const knexConex = knex(knexConfig.development) //aciona o knex e passa as configurações estabelecidas no arquivo

//retornar todos os dados
const selectAllRanking = async function(){

    try {
        
        //criando variável sql
        let sql = `select * from vwRanking;`

        //enviando para o banco de dados
        let result = await knexConex.raw(sql)

        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0]
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateVisibilidadeRanking = async function(exibirRanking){
    try {
        // exibir deve ser true ou false
        let sql = `update tbl_usuario set exibir_ranking = 
            ${exibirRanking.exibir_ranking} where id = ${exibirRanking.id};`
        
        //enviando para o banco de dados
        let result = await knexConex.raw(sql)
        //Verificando se é um array
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retornar dado com base no id
const selectByIdUsuario = async function(id){

    try {
        
        let sql = `select * from tbl_usuario where id = ${id};`
        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {selectAllRanking, updateVisibilidadeRanking, selectByIdUsuario}