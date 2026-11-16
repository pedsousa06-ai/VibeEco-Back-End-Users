/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * usuario_missao
 * Data: 16/11/2026
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

//Função para atualizar os dados da tabela
const updateUsuario = async function (usuario) {
    try {
        let sql = `update tbl_usuario set
        total_xp      =  ${usuario.total_xp},
        coins         = '${usuario.coins}'
        where id      =  ${usuario.id};`

        let result = await knexConex.raw(sql)
        if (result){
            return true
        }
        else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

module.exports = {selectByIdUsuario ,updateUsuario}