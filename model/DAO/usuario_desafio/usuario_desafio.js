/********************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela de usuario_desafio
 * Data: 03/11/2026
 * Autor: Lucas Dias Brandão Kolle
 * Versão: 1.0.10.26
 ********************************************************************************************************************************************************************************************/

//importando a biblioteca para gerenciar o banco de dados no node.js
const knex = require("knex")

//importando o arquivo "database_config_knex" para atribuir as configurações do BD
const knexConfig = require("../../database_config_knex/knex_file.js")

//criando a conexão por meio do arquivo que contém os dados necessários para estabelecer o acesso e a conexão
const knexConex = knex(knexConfig.development) //aciona o knex e passa as configurações estabelecidas no arquivo

/*INICIANDO CRUD DA TABELA DE USUARIO_DESAFIO (TABELA INTERMEDIÁRIA)*/

//função para inserir dados
const insertUsuarioDesafio = async function(usuarioDesafio){

    try {
        
        let sql = 
            `insert into tbl_usuario_desafio (
                id_usuario,
                id_desafio,
                data_conclusao
            )
            values (
                ${usuarioDesafio.id_usuario},
                ${usuarioDesafio.id_desafio},
                null
            );`

        let result = await knexConex.raw(sql) 

        if(result)
            return result[0].insertId 
        else
            return false
        
    } catch (error) {
        console.log(error)
        return false
    }
}

//função para atualizar um dado
const updateUsuarioDesafio = async function(usuarioDesafio){

    try {

        let sql =   `update tbl_usuario_desafio set 
                        id_usuario      = ${usuarioDesafio.id_usuario},
                        id_desafio      = ${usuarioDesafio.id_desafio},
                        status          = "${usuarioDesafio.status}",
                        data_conclusao  = now()

                    where id = ${usuarioDesafio.id};`

        let result = await knexConex.raw(sql)

        if(result){
            return true
        }else{
            return false
        }
        
    } catch (error) {
        return false
    }
}

//função para retornar um dado pelo id
const selectUsuarioDesafioByIdDesafioByIdUsuario = async function(id_usuario, id_desafio){

    try {
        
        let sql = `call procListarDesafioIdDesafioIdUsuario(${id_desafio},${id_usuario});`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){ 

            return result[0][0]

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//função para retornar um dado pelo id
const selectUsuarioDesafioByIdDesafio = async function(id_desafio){

    try {
        
        let sql = `call procListarDesafioIdDesafio(${id_desafio});`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){ 

            return result[0][0]

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//função para retornar um dado pelo id
const selectAllUsuarioDesafioByIdUsuario = async function(id_usuario){

    try {
        
        let sql = `call procListarDesafioIdUsuarioTodos(${id_usuario});`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){ 

            return result[0][0]

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Read
const selectByIdUsuarioDesafio = async function (id) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarDesafioIdUsuarioDesafio(${id});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//função para retornar um dado pelo id
const selectIndiviudalColetivoUsuarioDesafioByIdUsuario = async function(id_usuario, id_tipo_desafio){

    try {
        
        let sql = `call procListarDesafioIdUsuarioIndividuaisColetivos(${id_usuario}, ${id_tipo_desafio});`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){ 

            return result[0][0]

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//função para deletar um dado pelo id
const deleteUsuarioDesafio = async function(id){

    try {

        //criando variável sql
        let sql = `delete from tbl_usuario_desafio where id = ${id};`

        //enviando para o banco
        let result = await knexConex.raw(sql)

        //tratando retorno
        if(result){
            return true
        }else{
            return false
        }
        
    } catch (error) {
        return false
    }
}


module.exports = {
    insertUsuarioDesafio,
    updateUsuarioDesafio,
    selectByIdUsuarioDesafio,
    selectUsuarioDesafioByIdDesafioByIdUsuario,
    selectUsuarioDesafioByIdDesafio,
    selectAllUsuarioDesafioByIdUsuario,
    selectIndiviudalColetivoUsuarioDesafioByIdUsuario,
    deleteUsuarioDesafio,
}