/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação
   de dados para o CRUD de post_categoria
 * Data: 23.10.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const postCategoriaDAO = require('../../model/DAO/post_categoria/post_categoria.js')

//Criar
const inserirNovoPostCategoria = async function(postCategoria) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validar = await validarDados(postCategoria)
        if(validar)
            return validar //400
        else{
            let result = await postCategoriaDAO.insertNewPostCategoria(postCategoria)
            if(result){
                /*
                    Criando o atributo ID no JSON do genero e colocando
                    o ID gerado após o insert
                */
               postCategoria.id = result
               message.DEFAULT_MESSAGE.status       = message.SUCCESS_CREATED_ITEM.status
               message.DEFAULT_MESSAGE.status_code  = message.SUCCESS_CREATED_ITEM.status_code
               message.DEFAULT_MESSAGE.message      = message.SUCCESS_CREATED_ITEM.message
               message.DEFAULT_MESSAGE.response     = postCategoria //201
            }else
                message.ERROR_INTERNAL_SERVER_MODEL //500(banco de dados)
        }
        return message.DEFAULT_MESSAGE  //Retorno da mensagem do try
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}

//Atualizar
const atualizarPostCategoria = async function (postCategoria, id) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let resultBuscarID = await buscarPostCategoria(id)
            if(resultBuscarID.status){
                //Validação de campos obrigatórios para atualização (body)
                let validar = await validarDados(postCategoria)
                if(!validar){
                    //Adicionando o atributo ID da categoria no JSON para ser enviado ao DAO
                    postCategoria.id = id
                    //Chama a função do DAO para atualizar a categoria
                    let result = await postCategoriaDAO.updatePostCategoria(postCategoria)
                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = postCategoria
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
const buscarPostCategoria = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postCategoriaDAO.selectPostCategoriasById(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.postCategoria = result //201
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
const buscarPostIdCategoria = async function (idCategoria) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idCategoria == '' || idCategoria == null || idCategoria == undefined || isNaN(idCategoria)){
            message.ERROR_BAD_REQUEST.field = '[ID CATEGORIA] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postCategoriaDAO.selectPostCategoriasByIdCategoria(idCategoria)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.postCategoria = result //201
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
const buscarCategoriaIdPost = async function (idPost) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idPost == '' || idPost == null || idPost == undefined || isNaN(idPost)){
            message.ERROR_BAD_REQUEST.field = '[ID POST] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postCategoriaDAO.selectPostCategoriasByIdPost(idPost)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.postCategoria = result //201
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
const excluirPostCategoria = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let resultBuscarID = await buscarPostCategoria(id)
        if(resultBuscarID.status){
            let result = await postCategoriaDAO.deletePostCategoria(id)
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
const excluirCategoriasIdPost = async function (idPost) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let result = await postCategoriaDAO.deleteCategoriasByIdPost(idPost)
            if(result){
                message.DEFAULT_MESSAGE.status      = message.SUCESS_DELETE_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCESS_DELETE_ITEM.status_code
                message.DEFAULT_MESSAGE.message     = message.SUCESS_DELETE_ITEM.message
                
                return message.DEFAULT_MESSAGE
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
    } catch (error) {
        return message.DEFAULT_MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função de validação (não há a necessidade de exporta-la)
const validarDados = async function (postCategoria) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos da categoria (400)
        if(postCategoria.id_post == '' || postCategoria.id_post == null || postCategoria.id_post == undefined || isNaN(postCategoria.id_post)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        } else if(postCategoria.id_categoria == '' || postCategoria.id_categoria == null || postCategoria.id_categoria == undefined || isNaN(postCategoria.id_categoria)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_CATEGORIA] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else
            return false
}

module.exports = {
    inserirNovoFilmeGenero,
    atualizarFilmeGenero,
    listarFilmeGeneros,
    buscarFilmeGenero,
    buscarFilmeIdGenero,
    buscarGeneroIdFilme,
    excluirFilmeGenero,
    excluirGenerosIdFilme
}