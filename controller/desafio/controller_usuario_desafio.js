/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação de dados para o CRUD
 * Data: 18.11.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD no banco de dados
const usuarioDesafioDAO = require('../../model/DAO/usuario_desafio/usuario_desafio.js')
const controller_desafio_categoria = require('./controller_desafio_categoria.js')

//Criar
const inserirUsuarioDesafio = async function(usuarioDesafio, contentType) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //validando content type
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){
            let validar = await validarDados(usuarioDesafio)
            if(validar)
                return validar //400
            else{
                let result = await usuarioDesafioDAO.insertUsuarioDesafio(usuarioDesafio)
                if(result){
                    /*
                        Criando o atributo ID no JSON do comentario e colocando
                        o ID gerado após o insert
                    */
                usuarioDesafio.id = result
                message.DEFAULT_MESSAGE.status       = message.SUCCESS_CREATED_ITEM.status
                message.DEFAULT_MESSAGE.status_code  = message.SUCCESS_CREATED_ITEM.status_code
                message.DEFAULT_MESSAGE.message      = message.SUCCESS_CREATED_ITEM.message
                message.DEFAULT_MESSAGE.response     = usuarioDesafio //201
                return message.DEFAULT_MESSAGE  //Retorno da mensagem do try
                }else
                    return message.ERROR_INTERNAL_SERVER_MODEL //500(banco de dados)
            }
        }else
            return message.ERROR_CONTENT_TYPE //415 (retorna erro de tipo de dados) 

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}

//Atualizar
const atualizarUsuarioDesafio = async function (usuarioDesafio, id, contentType) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação do contentType para receber apenas JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let resultBuscarID = await buscarUsuarioDesafio(id)
            if(resultBuscarID.status){
                //Validação de campos obrigatórios para atualização (body)
                let validar = await validarDados(usuarioDesafio)
                if(!validar){
                    //Adicionando o atributo ID da categoria no JSON para ser enviado ao DAO
                    usuarioDesafio.id = id
                    //Chama a função do DAO para atualizar a categoria
                    let result = await usuarioDesafioDAO.updateUsuarioDesafio(usuarioDesafio)
                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = usuarioDesafio
                        return message.DEFAULT_MESSAGE //200 (Atualizado)
                    }else
                        return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
                }else
                    return validar
            }else
               return resultBuscarID //404, 400, 500 (resultBuscarId)
        }else
            return message.ERROR_CONTENT_TYPE //415(ContentType)
    } catch (error) {
        //console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Ler
const buscarUsuarioDesafio = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioDesafioDAO.selectByIdUsuarioDesafio(id)
            if(result){
                await exibirCategoriasDesafio(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_desafio = result //201
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
const buscarUsuarioDesafioIdDesafio = async function (idDesafio) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idDesafio == '' || idDesafio == null || idDesafio == undefined || isNaN(idDesafio)){
            message.ERROR_BAD_REQUEST.field = '[ID DESAFIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioDesafioDAO.selectUsuarioDesafioByIdDesafio(idDesafio)
            if(result){
                await exibirCategoriasDesafio(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_desafio = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
               return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
        }
    } catch (error) {
        //console.log(error)
       return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

//Ler
const buscarTodosUsuarioDesafioIdUsuario = async function (idUsuario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idUsuario == '' || idUsuario == null || idUsuario == undefined || isNaN(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioDesafioDAO.selectAllUsuarioDesafioByIdUsuario(idUsuario)
            if(result){
                await exibirCategoriasDesafio(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_desafio = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
        }
    } catch (error) {
        //console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

//Ler
const buscarUsuarioDesafioIdUsuarioIdDesafio = async function (idUsuario, idDesafio) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idUsuario == '' || idUsuario == null || idUsuario == undefined || isNaN(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else if(idDesafio == '' || idDesafio == null || idDesafio == undefined || isNaN(idDesafio)){
            message.ERROR_BAD_REQUEST.field = '[ID DESAFIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioDesafioDAO.selectUsuarioDesafioByIdDesafioByIdUsuario(idDesafio, idUsuario)
            if(result){
                await exibirCategoriasDesafio(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_desafio = result //201
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
const buscarIndividualColetivoUsuarioDesafioIdUsuario = async function (idUsuario, id_tipo_desafio) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idUsuario == '' || idUsuario == null || idUsuario == undefined || isNaN(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else if(id_tipo_desafio == '' || id_tipo_desafio == null || id_tipo_desafio == undefined || isNaN(id_tipo_desafio)){
            message.ERROR_BAD_REQUEST.field = '[ID TIPO_DESAFIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioDesafioDAO.selectIndiviudalColetivoUsuarioDesafioByIdUsuario(idUsuario, id_tipo_desafio)
            if(result){
                await exibirCategoriasDesafio(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_desafio = result //201
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
const excluirUsuarioDesafio = async function (id) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let result = await usuarioDesafioDAO.deleteUsuarioDesafio(id)
        if (result) {
            message.DEFAULT_MESSAGE.status      = message.SUCCESS_DELETED_ITEM.status
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETED_ITEM.status_code
            message.DEFAULT_MESSAGE.message     = message.SUCCESS_DELETED_ITEM.message
            return message.DEFAULT_MESSAGE
        } else {
            return message.ERROR_NOT_FOUND //404 (não existia curtida desse usuário nesse post)
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Exibir categorias da missao
const exibirCategoriasDesafio = async function(result){
    for(const desafios of result){
        //Cria o objeto de categorias relacionados a missao
        let resultCategoria = await controller_desafio_categoria.buscarDesafioCategoriaIdDesafio(desafios.id_desafio)
        if(resultCategoria.status){
            desafios.categoria = resultCategoria.response.desafio_categoria
        }
    }
}

//Função de validação (não há a necessidade de exporta-la)
const validarDados = async function (usuarioDesafio) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))

    //Validação de dados para os atributos do usuario_missao (400)
    if (usuarioDesafio.id_desafio == '' || usuarioDesafio.id_desafio == null || usuarioDesafio.id_desafio == undefined || isNaN(usuarioDesafio.id_desafio)) {
        message.ERROR_BAD_REQUEST.field = '[ID_DESAFIO] INVÁLIDO' //400
        return message.ERROR_BAD_REQUEST
    } else if (usuarioDesafio.id_usuario == '' || usuarioDesafio.id_usuario == null || usuarioDesafio.id_usuario == undefined || isNaN(usuarioDesafio.id_usuario)) {
        message.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO' //400
        return message.ERROR_BAD_REQUEST
    } else
        return false
}

module.exports = {
    inserirUsuarioDesafio,
    atualizarUsuarioDesafio,
    buscarUsuarioDesafio,
    buscarUsuarioDesafioIdDesafio,
    buscarTodosUsuarioDesafioIdUsuario,
    buscarUsuarioDesafioIdUsuarioIdDesafio,
    buscarIndividualColetivoUsuarioDesafioIdUsuario,
    excluirUsuarioDesafio,
}