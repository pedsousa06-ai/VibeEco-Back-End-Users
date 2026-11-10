/********************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo SELECT no Banco de dados MySQL na tabela de user
 * Data: 10/11/2026
 * Autor: Riller
 * Versão: 1.0.10.26
 ********************************************************************************************************************************************************************************************/

//importando a biblioteca para gerenciar o banco de dados no node.js
const knex = require("knex")

//importando o arquivo "database_config_knex" para atribuir as configurações do BD
const knexConfig = require("../../database_config_knex/knex_file.js")

//criando a conexão por meio do arquivo que contém os dados necessários para estabelecer o acesso e a conexão
const knexConex = knex(knexConfig.development) //aciona o knex e passa as configurações estabelecidas no arquivo

//retorna todos os dados do usuario
const selectDadosInicioByIdUsuario = async function(id){

    try {
        
        //criando variável sql
        let sql = `call procListarDadosInicio(${id});`

        //enviando para o banco de dados
        let result = await knexConex.raw(sql)

        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0][0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retorna todas as missoes em andamento
const selectMissoesAndamentoByIdUsuario = async function(id){

    try {
        
        //criando variável sql
        let sql = `call procListarMissaoEmAndamento(${id});`

        //enviando para o banco de dados
        let result = await knexConex.raw(sql)

        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0][0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retorna todos os conteudos recomendados
const selectConteudosRecomendadosByIdUsuario = async function(id){

    try {
        
        //criando variável sql
        let sql = `call procListarConteudoEducativoUsuario(${id});`

        //enviando para o banco de dados
        let result = await knexConex.raw(sql)

        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0][0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retorna a ofensiva do usuario
const selectOfensivaByIdUsuario = async function(id){

    try {
        
        //criando variável sql
        let sql = `call procListarOfensivaUsuario(${id});`

        //enviando para o banco de dados
        let result = await knexConex.raw(sql)

        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0][0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retorna todos os desafios em destaque
const selectDesafiosDestaque = async function(){

    try {
        
        //criando variável sql
        let sql = `select * from vwDesafios;`

        //enviando para o banco de dados
        let result = await knexConex.raw(sql)

        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retorna todas as conquistas do usuario
const selectConquistasByIdUsuario = async function(id){

    try {
        
        //criando variável sql
        let sql = `call procListarConquistasUsuario(${id});`

        //enviando para o banco de dados
        let result = await knexConex.raw(sql)

        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0][0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

module.exports = {
    selectDadosInicioByIdUsuario,
    selectMissoesAndamentoByIdUsuario,
    selectConteudosRecomendadosByIdUsuario,
    selectOfensivaByIdUsuario,
    selectDesafiosDestaque,
    selectConquistasByIdUsuario
}