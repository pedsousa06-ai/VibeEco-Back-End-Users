/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação
   de dados para o ranking
 * Data: 05.11.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do post no banco de dados
const rankingDAO = require('../../model/DAO/ranking/ranking.js')

//Atualizar
const atualizarRanking = async function (exibirRanking, id, contentType) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let resultBuscarID = await buscarRankingId(id)
            if(resultBuscarID.status){
                //Validação de campos obrigatórios para atualização (body)
                let validar = await validarDados(exibirRanking, contentType)
                if(!validar){
                    //Adicionando o atributo ID da categoria no JSON para ser enviado ao DAO
                    exibirRanking.id = id
                    //Chama a função do DAO para atualizar a categoria
                    let result = await rankingDAO.updateVisibilidadeRanking(exibirRanking)
                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = exibirRanking
                        return message.DEFAULT_MESSAGE //200 (Atualizado)
                    }else
                        return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
                }else
                    return validar
            }else
               return resultBuscarID //404, 400, 500 (resultBuscarId)
    } catch (error) {
        //console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Ler
const listarRanking = async function () {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let result = await rankingDAO.selectAllRanking()
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.ranking = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
               return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
    } catch (error) {
       return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

//Ler
const buscarRankingId = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await rankingDAO.selectByIdUsuario(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.exibir_ranking = result //201
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

//Função de validação (não há a necessidade de exporta-la)
const validarDados = async function (exibirRanking, contentType) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos do exibirRanking (status 400)
    //Validação para o tipo de dados da requisição (somente JSON)
    if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
        if (exibirRanking.exibir_ranking == '' || exibirRanking.exibir_ranking == null || exibirRanking.exibir_ranking == undefined) {
            message.ERROR_BAD_REQUEST.field = '[EXIBIR_RANKING] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        } 
        else
            return false

    } else
        return message.ERROR_CONTENT_TYPE
}

module.exports = {listarRanking, atualizarRanking}