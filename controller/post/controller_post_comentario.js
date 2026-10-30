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
const postComentarioDAO = require('../../model/DAO/post_comentario/post_comentario.js')

//Criar
const inserirPostComentario = async function(postComentario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validar = await validarDados(postComentario)
        if(validar)
            return validar //400
        else{
            console.log("Estou aqui")
            let result = await postComentarioDAO.insertPostComentario(postComentario)
            if(result){
                /*
                    Criando o atributo ID no JSON do comentario e colocando
                    o ID gerado após o insert
                */
               postComentario.id = result
               message.DEFAULT_MESSAGE.status       = message.SUCCESS_CREATED_ITEM.status
               message.DEFAULT_MESSAGE.status_code  = message.SUCCESS_CREATED_ITEM.status_code
               message.DEFAULT_MESSAGE.message      = message.SUCCESS_CREATED_ITEM.message
               message.DEFAULT_MESSAGE.response     = postComentario //201
            }else
                message.ERROR_INTERNAL_SERVER_MODEL //500(banco de dados)
        }
        return message.DEFAULT_MESSAGE  //Retorno da mensagem do try
    } catch (error) {
        //console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}

//Atualizar
const atualizarPostComentario = async function (postComentario, id) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let resultBuscarID = await buscarPostComentario(id)
            if(resultBuscarID.status){
                //Validação de campos obrigatórios para atualização (body)
                let validar = await validarDados(postComentario)
                if(!validar){
                    //Adicionando o atributo ID da categoria no JSON para ser enviado ao DAO
                    postComentario.id = id
                    //Chama a função do DAO para atualizar a categoria
                    let result = await postComentarioDAO.updatePostComentario(postComentario)
                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = postComentario
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
const buscarPostComentario = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postComentarioDAO.selectByIdPostComentarios(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_comentario = result //201
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
const buscarPostComentarioIdUsuario = async function (idUsuario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idUsuario == '' || idUsuario == null || idUsuario == undefined || isNaN(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUÁRIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postComentarioDAO.selectPostComentarioByIdUsuario(idUsuario)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_comentario = result //201
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
const buscarPostComentarioIdPost = async function (idPost) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idPost == '' || idPost == null || idPost == undefined || isNaN(idPost)){
            message.ERROR_BAD_REQUEST.field = '[ID POST] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postComentarioDAO.selectPostComentarioByIdPost(idPost)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post_comentario = result //201
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
const excluirPostComentario = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let resultBuscarID = await buscarPostComentario(id)
        if(resultBuscarID.status){
            let result = await postComentarioDAO.deletePostComentario(id)
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
const excluirComentarioIdPost = async function (idPost) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let result = await postComentarioDAO.deleteComentarioByIdPost(idPost)
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
const validarDados = async function (postComentario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos do post (400)
        if(postComentario.id_post == '' || postComentario.id_post == null || postComentario.id_post == undefined || isNaN(postComentario.id_post)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_POST] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        } else if(postComentario.id_usuario == '' || postComentario.id_usuario == null || postComentario.id_usuario == undefined || isNaN(postComentario.id_usuario)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else if(postComentario.comentario == '' || postComentario.comentario == null || postComentario.comentario == undefined){
            message.ERROR_BAD_REQUEST.field = '[COMENTARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else            
            return false
}

module.exports = {
    inserirPostComentario,
    atualizarPostComentario,
    buscarPostComentario,
    buscarPostComentarioIdPost,
    buscarPostComentarioIdUsuario,
    excluirPostComentario,
    excluirComentarioIdPost
}