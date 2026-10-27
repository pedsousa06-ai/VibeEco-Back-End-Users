/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação
   de dados para o CRUD de post
 * Data: 21.10.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do post no banco de dados
const postDAO = require('../../model/DAO/post/post.js')

//Criar
const inserirNovoPost = async function(post, contentType) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validar = await validarDados(post, contentType)
        if(validar)
            return validar //400
        else{
            let result = await postDAO.insertNewPost(post)
            if(result){
                /*
                    Criando o atributo ID no JSON do post e colocando
                    o ID gerado após o insert
                */
               post.id = result
               message.DEFAULT_MESSAGE.status       = message.SUCCESS_CREATED_ITEM.status
               message.DEFAULT_MESSAGE.status_code  = message.SUCCESS_CREATED_ITEM.status_code
               message.DEFAULT_MESSAGE.message      = message.SUCCESS_CREATED_ITEM.message
               message.DEFAULT_MESSAGE.response     = post //201
            }else
                message.ERROR_INTERNAL_SERVER_MODEL //500(banco de dados)
        }
        return message.DEFAULT_MESSAGE  //Retorno da mensagem do try
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}

//Atualizar
const atualizarPost = async function (post, id, contentype) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação do contentType para receber formato de dados em JSON
        if(String(contentype).toUpperCase() == 'APPLICATION/JSON'){
            let resultBuscarID = await buscarPost(id)
            if(resultBuscarID.status){
                //Validação de campos obrigatórios para atualização (body)
                let validar = await validarDados(post, contentype)
                if(!validar){
                    //Adicionando o atributo ID do post no JSON para ser enviado ao DAO
                    post.id = id
                    //Chama a função do DAO para atualizar o post
                    let result = await postDAO.updatePost(post)
                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = post
                        return message.DEFAULT_MESSAGE //200 (Atualizado)
                    }else{
                        return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
                    }
                }
            }else{
               return resultBuscarID //404, 400, 500 (resultBuscarId)
            }
        }else
            return message.DEFAULT_MESSAGE.ERROR_CONTENT_TYPE //415(contentType)
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}   

//Ler
const listarPost = async function () {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Chama a função do DAO para retornar a lista de todos os filmes
        let result = await postDAO.selectAllPost()
        //Validação para verificar se o DAO conseguiu processar os dados
        if(result){
            //Validação para verificar se existe conteúdo no array
            if(result.length > 0){
                message.DEFAULT_MESSAGE.status              = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code         = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count      = result.length
                message.DEFAULT_MESSAGE.response.post     = result
                return message.DEFAULT_MESSAGE
            }else
                return message.ERROR_NOT_FOUND //404 (Dados não encontrado)
        }else
            return message.ERROR_INTERNAL_SERVER_MODEL //500 (model) Erro no BD
    } catch (error) {
        //console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller) Erro no backEnd
    }
}

//Ler
const listarPostRelevantes = async function () {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let result = await postDAO.selectAllRelevantPost()
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post = result //201
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
const buscarPost = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postDAO.selectPostById(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.post = result //201
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
const excluirPost = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let resultBuscarID = await buscarPost(id)
        if(resultBuscarID.status){
            let result = await postDAO.deletePost(id)
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
        //console.log(error)
        return message.DEFAULT_MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função de validação (não há a necessidade de exporta-la)
const validarDados = async function (post, contentType) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos do post (400)
    //Validação para o tipo de dados da requisição (somente JSON)
    if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
        if(post.descricao == '' || post.descricao == null || post.descricao == undefined || post.descricao.length <= 0){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[POST] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else if(post.id_usuario == '' || post.id_usuario == null || post.id_usuario == undefined || isNaN(post.id_usuario)){
            message.ERROR_BAD_REQUEST.field = '[USUÁRIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else
            return false
    }else
        return message.ERROR_CONTENT_TYPE
}

module.exports = {
    inserirNovoPost,
    atualizarPost,
    listarPost,
    listarPostRelevantes,
    buscarPost,
    excluirPost
}