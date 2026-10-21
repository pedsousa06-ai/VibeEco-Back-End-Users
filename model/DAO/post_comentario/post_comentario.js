/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * Post
 * Data: 19/10/2026
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

//Função para inserir dados na tabela de post_comentario
const insertNewPostComentario = async function (post_comentario) {
    try {
        let sql = `insert into tbl_post_comentario (
            id_usuario,
            id_post,
            comentario,
            data_comentario
        )values(
            '${post_comentario.id_usuario}',
            '${post_comentario.id_post}',
            '${post_comentario.comentario}',
            now()
    );`
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Função para atualizar os dados da tabela de post_comentario
const updatePostComentario = async function (post_comentario) {
    try {
    let sql = `update tbl_post_comentario set
        id_usuario      =  ${post_comentario.id_usuario},
        id_post         = '${post_comentario.id_post}',
        comentario      = '${post_comentario.comentario}'
        wherer id       =  ${post_comentario.id};`

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

//Funcao para visualizar todos os comentarios do post
const selectPostComentarioById = async function (id) {
    try {
        let sql = `call procListarComentarios(${id});`
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

//Função para deletar um comentario
const deletePostComentario = async function (id) {
    try {
        let sql = `delete from tbl_post_comentario where id = ${id}`
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
    insertNewPostComentario,
    updatePostComentario,
    selectPostComentarioById,
    deletePostComentario
}