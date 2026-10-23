/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * Post
 * Data: 07/10/2026
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

//Função para inserir dados na tabela de post
const insertNewPost = async function (post) {
    try {
        let sql = `insert into tbl_post (
            id_usuario,
            descricao,
            data_publicacao
            )
            values(
                    '${post.id_usuario}',
                    '${post.descricao}',
	                now()
            );`
    //Executar o script no BD
    let result = await knexConex.raw(sql)
        //Validando
        if(result)
            return result[0].insertId
        else
             return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Função para atualizar os dados da tabela de post
const updatePost = async function (post) {
    try {
    let sql = `update tbl_post set
        id_usuario      =  ${post.id_usuario},
        descricao       = '${post.descricao}'
        where id       =  ${post.id};`

    let result = await knexConex.raw(sql)
    if(result)
        return true
    else
        return false
    } catch (error) {
        //console.log(error)
        return false    
    }
}

//Posts mais recentes
const selectAllPost = async function () {
    try {
        let sql = `select * from vwPostRecente;`
        let result = await knexConex.raw(sql)

        if(Array.isArray(result))
            return result [0]
        else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Posts mais relevantes
const selectAllRelevantPost = async function () {
    try {
        let sql = `select * from vwPostCurtidas;`
        let result = await knexConex.raw(sql)

        if(Array.isArray(result))
            return result [0]
        else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Função para selecionar post pelo id
const selectPostById = async function (id) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarPostViaId(${id});`
        let result = await knexConex.raw(sql)
        if(Array.isArray(result)){
            return result[0][0]
        }else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Função para deletar um post
const deletePost = async function (id) {
    try {
        let sql = `delete from tbl_post where id = ${id}`
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

module.exports = {
    insertNewPost,
    updatePost,
    selectAllPost,
    selectAllRelevantPost,
    selectPostById,
    deletePost
}