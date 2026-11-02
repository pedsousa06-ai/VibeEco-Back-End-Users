/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * Post
 * Data: 02/11/2026
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
            id_anexo,
        )values(
            '${post_anexo.id_usuario}',
            '${post_anexo.id_anexo}',
        );`
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

//Função para atualizar os dados da tabela de post_anexo
const updatePostAnexo = async function (post_anexo) {
    try {
    let sql = `update tbl_post_anexo set
        id_usuario     =  ${post_anexo.id_usuario},
        id_anexo       = '${post_anexo.id_anexo}',
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

//Select com critério de filtro o id do post
const selectPostAnexoByIdPost = async function (id_post) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarPostAnexosByIdPost(${id_post})`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados do post filtrando pelo id do do anexo)
const selectPostAnexoByIdAnexo = async function (id_anexo) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarPostAnexosByIdAnexo(${id_anexo});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados do anexo filtrando pelo id do post)
const selectByIdPostAnexo = async function (id) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarByIdPostAnexos(${id});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Delete
const deletePostAnexo = async function (id) {
    try {
        let sql = `delete from tbl_post_anexo where id = ${id};`
        let result = await knexConex.raw(sql)
        if (result) {
            return true
        } else
            return false
    } catch (error) {
        return false
    }
}

//Delete (Função para excluir os anexos filtrando pelo ID do post)
/*
    Essa função será utilizada após o update do post, pois será necessário
    apagar todos os anexos relacionados com o post para inserir as novas
    relações, é uma forma de otimizar o trabalho, pois não precisamos verificar
    o que foi alterado do original.
*/
const deleteAnexoByIdPost = async function (idPost) {
    try {
        let sql = `delete from tbl_post_anexo where id_post = ${idPost};`
        let result = await knexConex.raw(sql)
        if (result) {
            return true
        } else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertNewPostAnexo,
    updatePostAnexo,
    selectByIdPostAnexo,
    selectPostAnexoByIdPost,
    selectPostAnexoByIdAnexo,
    deletePostAnexo,
    deleteAnexoByIdPost
}