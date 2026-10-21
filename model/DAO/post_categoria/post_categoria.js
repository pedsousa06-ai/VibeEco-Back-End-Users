/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * Post
 * Data: 21/10/2026
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

//Função para inserir dados na tabela de post_categoria
const insertNewPostCategoria = async function (post_categoria) {
    try {
        let sql = `insert into tbl_post_categoria (
            id_post,
            id_categoria,
        )values(
            '${post_categoria.id_post}',
            '${post_categoria.id_categoria}',
        );`
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Função para atualizar os dados da tabela de post_categoria
const updatePostCategoria = async function (post_categoria) {
    try {
    let sql = `update tbl_post_categoria set
        id_post      =  ${post_categoria.id_post},
        id_categoria = '${post_categoria.id_categoria}',
        wherer id    =  ${post_categoria.id};`

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

//Funcao para visualizar todos as categorias do post
const selectPostCategoriasById = async function (id) {
    try {
        let sql = `call procListarPostCategorias(${id});`
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

//Função para deletar uma categoria do post
const deletePostCategoria = async function (id) {
    try {
        let sql = `delete from tbl_post_categoria where id = ${id}`
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
    insertNewPostCategoria,
    updatePostCategoria,
    selectPostCategoriasById,
    deletePostCategoria
}