/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * Post
 * Data: 20/10/2026
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

//Função para inserir dados na tabela de post_anexo
const insertNewPostAnexo = async function (post_anexo) {
    try {
        let sql = `insert into tbl_post_anexo (
            id_usuario,
            id_post,
        )values(
            '${post_anexo.id_usuario}',
            '${post_anexo.id_post}',
        );`
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Função para atualizar os dados da tabela de post_anexo
const updatePostAnexo = async function (post_anexo) {
    try {
    let sql = `update tbl_post_anexo set
        id_usuario      =  ${post_anexo.id_usuario},
        id_post         = '${post_anexo.id_post}',
        where id       =  ${post_anexo.id};`

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

//Funcao para visualizar todos os anexos do post
const selectPostAnexosById = async function (id) {
    try {
        let sql = `call procListarPostAnexos(${id});`
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

//Função para deletar um anexo do post
const deletePostAnexo = async function (id) {
    try {
        let sql = `delete from tbl_post_anexo where id = ${id}`
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
    insertNewPostAnexo,
    updatePostAnexo,
    selectPostAnexosById,
    deletePostAnexo
}