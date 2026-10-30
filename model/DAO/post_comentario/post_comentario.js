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
const insertPostComentario = async function (post_comentario) {
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
        console.log(error)
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
        where id        =   ${post_comentario.id};`

        let result = await knexConex.raw(sql)
        if (result)
            return true
        else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Select com critério de filtro o id do post
const selectPostComentarioByIdPost = async function (id) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarComentariosByIdPost(${id})`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados do post filtrando pelo id do usuario)
const selectPostComentarioByIdUsuario = async function (id_usuario) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarComentariosByIdUsuario(${id_usuario});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados do comentario filtrando pelo id do post)
const selectByIdPostComentarios = async function (id) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarComentariosByIdpostComentario(${id});`
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
const deletePostComentario = async function (id) {
    try {
        let sql = `delete from tbl_post_comentario where id = ${id};`
        let result = await knexConex.raw(sql)
        if (result) {
            return true
        } else
            return false
    } catch (error) {
        return false
    }
}

//Delete (Função para excluir os comentarios filtrando pelo ID do post)
/*
    Essa função será utilizada após o update do post, pois será necessário
    apagar todos os comentarios relacionados com o post para inserir as novas
    relações, é uma forma de otimizar o trabalho, pois não precisamos verificar
    o que foi alterado do original.
*/
const deleteComentarioByIdPost = async function (idPost) {
    try {
        let sql = `delete from tbl_post_comentario where id_post = ${idPost};`
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
    insertPostComentario,
    updatePostComentario,
    selectPostComentarioByIdPost,
    selectPostComentarioByIdUsuario,
    selectByIdPostComentarios,
    deleteComentarioByIdPost,
    deletePostComentario
}