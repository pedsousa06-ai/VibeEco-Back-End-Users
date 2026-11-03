/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação
   de dados para o CRUD de post_curtida
 * Data: 03.11.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const postCurtidaDAO = require('../../model/DAO/post_curtida/post_curtida.js')

//Criar
const inserirPostCurtida = async function(postCurtida) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validar = await validarDados(postCurtida)
        if(validar)
            return validar //400
        else{
            let result = await postCurtidaDAO.insertPostCurtida(postCurtida)
            if(result){
                /*
                    Criando o atributo ID no JSON do comentario e colocando
                    o ID gerado após o insert
                */
               postCurtida.id = result
               message.DEFAULT_MESSAGE.status       = message.SUCCESS_CREATED_ITEM.status
               message.DEFAULT_MESSAGE.status_code  = message.SUCCESS_CREATED_ITEM.status_code
               message.DEFAULT_MESSAGE.message      = message.SUCCESS_CREATED_ITEM.message
               message.DEFAULT_MESSAGE.response     = postCurtida //201
            }else
                return message.ERROR_INTERNAL_SERVER_MODEL //500(banco de dados)
        }
        return message.DEFAULT_MESSAGE  //Retorno da mensagem do try
    } catch (error) {
        //console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}

//Ler
const buscarPostCurtida = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postCurtidaDAO.selectByIdPostCurtida(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_curtida = result //201
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
const buscarPostCurtidaIdUsuario = async function (idUsuario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idUsuario == '' || idUsuario == null || idUsuario == undefined || isNaN(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUÁRIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postCurtidaDAO.selectPostCurtidaByIdUsuario(idUsuario)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_curtida = result //201
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
const buscarPostCurtidaIdPost = async function (idPost) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idPost == '' || idPost == null || idPost == undefined || isNaN(idPost)){
            message.ERROR_BAD_REQUEST.field = '[ID POST] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postCurtidaDAO.selectPostCurtidaByIdPost(idPost)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_curtida = result //201
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

//Excluir
const excluirPostCurtida = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let resultBuscarID = await buscarPostCurtida(id)
        if(resultBuscarID.status){
            let result = await postCurtidaDAO.deletePostCurtida(id)
            if(result){
                message.DEFAULT_MESSAGE.status      = message.SUCCESS_DELETED_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETED_ITEM.status_code
                message.DEFAULT_MESSAGE.message     = message.SUCCESS_DELETED_ITEM.message
                
                return message.DEFAULT_MESSAGE
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return resultBuscarID //404 (not found), 400 (error bad request), 500 (data base), 500 (controller) 
        }
    } catch (error) {
        return message.DEFAULT_MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função de validação (não há a necessidade de exporta-la)
const validarDados = async function (postCurtida) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos do post (400)
        if(postCurtida.id_post == '' || postCurtida.id_post == null || postCurtida.id_post == undefined || isNaN(postCurtida.id_post)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_POST] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        } else if(postCurtida.id_usuario == '' || postCurtida.id_usuario == null || postCurtida.id_usuario == undefined || isNaN(postCurtida.id_usuario)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else            
            return false
}

module.exports = {
    inserirPostCurtida,
    buscarPostCurtida,
    buscarPostCurtidaIdPost,
    buscarPostCurtidaIdUsuario,
    excluirPostCurtida,
}