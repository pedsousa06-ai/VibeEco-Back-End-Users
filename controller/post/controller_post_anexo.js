/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação
   de dados para o CRUD de post_categoria
 * Data: 28.10.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const postAnexoDAO = require('../../model/DAO/post_anexo/post_anexo.js')

//Criar
const inserirNovoPostAnexo = async function(postAnexo) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validar = await validarDados(postAnexo)
        if(validar)
            return validar //400
        else{
            let result = await postAnexoDAO.insertNewPostAnexo(postAnexo)
            if(result){
                /*
                    Criando o atributo ID no JSON do genero e colocando
                    o ID gerado após o insert
                */
               postAnexo.id = result
               message.DEFAULT_MESSAGE.status       = message.SUCCESS_CREATED_ITEM.status
               message.DEFAULT_MESSAGE.status_code  = message.SUCCESS_CREATED_ITEM.status_code
               message.DEFAULT_MESSAGE.message      = message.SUCCESS_CREATED_ITEM.message
               message.DEFAULT_MESSAGE.response     = postAnexo //201
            }else
                message.ERROR_INTERNAL_SERVER_MODEL //500(banco de dados)
        }
        return message.DEFAULT_MESSAGE  //Retorno da mensagem do try
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}

//Atualizar
const atualizarPostAnexo = async function (postAnexo, id) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let resultBuscarID = await buscarPostAnexo(id)
            if(resultBuscarID.status){
                //Validação de campos obrigatórios para atualização (body)
                let validar = await validarDados(postAnexo)
                if(!validar){
                    //Adicionando o atributo ID da categoria no JSON para ser enviado ao DAO
                    postAnexo.id = id
                    //Chama a função do DAO para atualizar a categoria
                    let result = await postAnexoDAO.updatePostAnexo(postAnexo)
                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = postAnexo
                        return message.DEFAULT_MESSAGE //200 (Atualizado)
                    }else
                        return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
                }else
                    return validar
            }else
               return resultBuscarID //404, 400, 500 (resultBuscarId)
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Ler
const buscarPostAnexo = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postAnexoDAO.selectByIdPostAnexo(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_categoria = result //201
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
const buscarPostIdAnexo = async function (idAnexo) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idAnexo == '' || idAnexo == null || idAnexo == undefined || isNaN(idAnexo)){
            message.ERROR_BAD_REQUEST.field = '[ID ANEXO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postAnexoDAO.selectPostAnexoByIdAnexo(idAnexo)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_anexo = result //201
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
const buscarAnexosIdPost = async function (idPost) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idPost == '' || idPost == null || idPost == undefined || isNaN(idPost)){
            message.ERROR_BAD_REQUEST.field = '[ID POST] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postAnexoDAO.selectPostAnexoByIdPost(idPost)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_anexo = result //201
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
const excluirPostAnexo = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let resultBuscarID = await buscarPostAnexo(id)
        if(resultBuscarID.status){
            let result = await postAnexoDAO.deletePostAnexo(id)
            if(result){
                message.DEFAULT_MESSAGE.status      = message.SUCESS_DELETE_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCESS_DELETE_ITEM.status_code
                message.DEFAULT_MESSAGE.message     = message.SUCESS_DELETE_ITEM.message
                
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

//Excluir (Função para excluir os gêneros relacionados com o filme)
const excluirAnexosIdPost = async function (idPost) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let result = await postAnexoDAO.deleteAnexoByIdPost(idPost)
            if(result){
                message.DEFAULT_MESSAGE.status      = message.SUCCESS_DELETED_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETED_ITEM.status_code
                message.DEFAULT_MESSAGE.message     = message.SUCCESS_DELETED_ITEM.message
                
                return message.DEFAULT_MESSAGE
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
    } catch (error) {
        return message.DEFAULT_MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função de validação (não há a necessidade de exporta-la)
const validarDados = async function (postAnexo) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos do post (400)
        if(postAnexo.id_post == '' || postAnexo.id_post == null || postAnexo.id_post == undefined || isNaN(postAnexo.id_post)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_POST] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        } else if(postAnexo.id_anexo == '' || postAnexo.id_anexo == null || postAnexo.id_anexo == undefined || isNaN(postAnexo.id_anexo)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_ANEXO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else
            return false
}

module.exports = {
    inserirNovoPostAnexo,
    atualizarPostAnexo,
    buscarPostAnexo,
    buscarAnexosIdPost,
    buscarPostIdAnexo,
    excluirPostAnexo,
    excluirAnexosIdPost
}