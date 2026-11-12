/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela 
 * usuario_missao
 * Data: 12/11/2026
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

//Função para inserir dados em tabela
const insertUsuarioMissao = async function (usuario_missao) {
    try {
        let sql = `insert into tbl_usuario_missao (
            id_usuario,
            id_missao,
            status,
            data_conclusao
        )values(
            '${usuario_missao.id_usuario}',
            '${usuario_missao.id_missao}',
            '${usuario_missao.status}',
            null
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

//Função para atualizar os dados da tabela
const updateUsuarioMissao = async function (usuario_missao) {
    try {
        let sql = `update tbl_usuario_missao set
        id_usuario      =  ${usuario_missao.id_usuario},
        id_missao       = '${usuario_missao.id_post}',
        status          = '${usuario_missao.status}'
        where id        =   ${usuario_missao.id};`

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

//Select com critério de filtro o id do post
const selectUsuarioMissaoByIdMissao = async function (id_missao) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarComentariosByIdPost(${id_missao})`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read
const selectUsuarioMissaoByIdUsuario = async function (id_usuario) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarComentariosByIdUsuario(${id_usuario});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//Read
const selectByIdUsuarioMissao = async function (id) {
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
const deleteUsuarioMissao = async function (id) {
    try {
        let sql = `delete from tbl_usuario_missao where id = ${id};`
        let result = await knexConex.raw(sql)
        if (result) {
            return true
        } else
            return false
    } catch (error) {
        return false
    }
}

//Delete
/*
    Essa função será utilizada após o update do post, pois será necessário
    apagar todos os comentarios relacionados com o post para inserir as novas
    relações, é uma forma de otimizar o trabalho, pois não precisamos verificar
    o que foi alterado do original.
*/
const deleteMissoesByIdUsuario = async function (id_usuario) {
    try {
        let sql = `delete from tbl_usuario_missao where id_usuario = ${id_usuario};`
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
    insertUsuarioMissao,
    updateUsuarioMissao,
    selectUsuarioMissaoByIdMissao,
    selectUsuarioMissaoByIdUsuario,
    selectByIdUsuarioMissao,
    deleteUsuarioMissao,
    deleteMissoesByIdUsuario
}