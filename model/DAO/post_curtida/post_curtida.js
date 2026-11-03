/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * Post
 * Data: 03/11/2026
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

//Função para inserir dados na tabela de post_curtida
const insertPostCurtida = async function (post_curtida) {
    try {
        let sql = `insert into tbl_post_curtida (
            id_usuario,
            id_post,
            data_curtida
        )values(
            '${post_curtida.id_usuario}',
            '${post_curtida.id_post}',
            now()
        );`
        let result = await knexConex.raw(sql)
        if (result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Select com critério de filtro o id do post
const selectPostCurtidaByIdPost = async function (id) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarCurtidasByIdPost(${id})`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados do post filtrando pelo id da curtida)
const selectPostCurtidaByIdUsuario = async function (id_usuario) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarCurtidasByIdUsuario(${id_usuario});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados do comentario filtrando pelo id do post)
const selectByIdPostCurtida = async function (id) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarCurtidasByIdPostCurtida(${id});`
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
const deletePostCurtidaByIdPostIdUsuario = async function (postCurtida) {
    try {
        let sql = `delete from tbl_post_curtida 
                        where id_post =         ${postCurtida.id_post} 
                            and id_usuario =    ${postCurtida.id_usuario}`
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
    insertPostCurtida,
    selectByIdPostCurtida,
    selectPostCurtidaByIdPost,
    selectPostCurtidaByIdUsuario,
    deletePostCurtidaByIdPostIdUsuario
}