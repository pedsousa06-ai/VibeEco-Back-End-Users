/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação de dados para o CRUD
 * Data: 18.11.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const desafioCategoriaDAO = require('../../model/DAO/desafio_categoria/desafio_categoria.js')

//Ler
const buscarDesafioCategoriaIdCategoria = async function (idCategoria) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idCategoria == '' || idCategoria == null || idCategoria == undefined || isNaN(idCategoria)){
            message.ERROR_BAD_REQUEST.field = '[ID CATEGORIA] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await desafioCategoriaDAO.selectDesafioCategoriaByIdCategoria(idCategoria)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.desafio_categoria = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
               return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
        }
    } catch (error) {
       return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

//Ler
const buscarDesafioCategoriaIdDesafio = async function (idDesafio) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idDesafio == '' || idDesafio == null || idDesafio == undefined || isNaN(idDesafio)){
            message.ERROR_BAD_REQUEST.field = '[ID DESAFIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await desafioCategoriaDAO.selectDesafioCategoriaByIdDesafio(idDesafio)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.desafio_categoria = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

module.exports = {
    buscarDesafioCategoriaIdCategoria,
    buscarDesafioCategoriaIdDesafio
}