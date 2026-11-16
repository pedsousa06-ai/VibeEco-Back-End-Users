/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação
   de dados para o CRUD de post_comentario
 * Data: 30.10.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const missaoCategoriaDAO = require('../../model/DAO/missao_categoria/missao_categoria.js')

//Ler
const buscarMissaoCategoriaIdCategoria = async function (idCategoria) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idCategoria == '' || idCategoria == null || idCategoria == undefined || isNaN(idCategoria)){
            message.ERROR_BAD_REQUEST.field = '[ID CATEGORIA] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await missaoCategoriaDAO.selectMissaoCategoriaByIdCategoria(idCategoria)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.missao_categoria = result //201
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
const buscarMissaoCategoriaIdMissao = async function (idMissao) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idMissao == '' || idMissao == null || idMissao == undefined || isNaN(idMissao)){
            message.ERROR_BAD_REQUEST.field = '[ID MISSAO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await missaoCategoriaDAO.selectMissaoCategoriaByIdMissao(idMissao)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.missao_categoria = result //201
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
    buscarMissaoCategoriaIdCategoria,
    buscarMissaoCategoriaIdMissao
}