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
const usuarioMissaoDAO = require('../../model/DAO/usuario_missao/usuario_missao.js')
const controllerMissaoEtapa = require('./controller_missao_etapa.js')
const controller_missao_categoria = require('./controller_missao_categoria.js')

//Criar
const inserirUsuarioMissao = async function(usuarioMissao, contentType) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //validando content type
        if(String(contentType).toUpperCase() == "APPLICATION/JSON"){
            let validar = await validarDados(usuarioMissao)
            if(validar)
                return validar //400
            else{
                let result = await usuarioMissaoDAO.insertUsuarioMissao(usuarioMissao)
                if(result){
                    /*
                        Criando o atributo ID no JSON do comentario e colocando
                        o ID gerado após o insert
                    */
                usuarioMissao.id = result
                message.DEFAULT_MESSAGE.status       = message.SUCCESS_CREATED_ITEM.status
                message.DEFAULT_MESSAGE.status_code  = message.SUCCESS_CREATED_ITEM.status_code
                message.DEFAULT_MESSAGE.message      = message.SUCCESS_CREATED_ITEM.message
                message.DEFAULT_MESSAGE.response     = usuarioMissao //201
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
const atualizarUsuarioMissao = async function (usuarioMissao, id, contentType) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação do contentType para receber apenas JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let resultBuscarID = await buscarUsuarioMissao(id)
            if(resultBuscarID.status){
                //Validação de campos obrigatórios para atualização (body)
                let validar = await validarDados(usuarioMissao)
                if(!validar){
                    //Adicionando o atributo ID da categoria no JSON para ser enviado ao DAO
                    usuarioMissao.id = id
                    //Chama a função do DAO para atualizar a categoria
                    let result = await usuarioMissaoDAO.updateUsuarioMissao(usuarioMissao)
                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = usuarioMissao
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
const buscarUsuarioMissao = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioMissaoDAO.selectByIdUsuarioMissao(id)
            if(result){
                await exibirCategoriasMissao(result)
                await exibirEtapasMissao(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_missao = result //201
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
const buscarUsuarioMissaoIdMissao = async function (idMissao) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idMissao == '' || idMissao == null || idMissao == undefined || isNaN(idMissao)){
            message.ERROR_BAD_REQUEST.field = '[ID MISSAO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioMissaoDAO.selectUsuarioMissaoByIdMissao(idMissao)
            if(result){
                await exibirCategoriasMissao(result)
                await exibirEtapasMissao(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_missao = result //201
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
const buscarUsuarioMissaoIdUsuario = async function (idUsuario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idUsuario == '' || idUsuario == null || idUsuario == undefined || isNaN(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioMissaoDAO.selectUsuarioMissaoByIdUsuario(idUsuario)
            if(result){
                await exibirCategoriasMissao(result)
                await exibirEtapasMissao(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_missao = result //201
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
const buscarUsuarioMissaoIdUsuarioIdMissao = async function (idUsuario, idMissao) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idUsuario == '' || idUsuario == null || idUsuario == undefined || isNaN(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else if(idMissao == '' || idMissao == null || idMissao == undefined || isNaN(idMissao)){
            message.ERROR_BAD_REQUEST.field = '[ID MISSAO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioMissaoDAO.selectByIdUsuarioByIdMissao(idMissao, idUsuario)
            if(result){
                await exibirCategoriasMissao(result)
                await exibirEtapasMissao(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_missao = result //201
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
const excluirUsuarioMissao = async function (id) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let result = await usuarioMissaoDAO.deleteUsuarioMissao(id)
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
const exibirCategoriasMissao = async function(result){
    for(const missoes of result){
        //Cria o objeto de categorias relacionados a missao
        let resultCategoria = await controller_missao_categoria.buscarMissaoCategoriaIdMissao(missoes.id_missao)
        if(resultCategoria.status){
            missoes.categoria = resultCategoria.response.missao_categoria
        }
    }
}

const exibirEtapasMissao = async function(result){
    for(const missoes of result){
        let resultEtapas = await controllerMissaoEtapa.buscarEtapasMissaoIdMissao(missoes.id_missao)
        if(resultEtapas.status){
            missoes.etapas = resultEtapas.response.etapas_missao
        }
    }
}

//Função de validação (não há a necessidade de exporta-la)
const validarDados = async function (usuarioMissao) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))

    //Validação de dados para os atributos do usuario_missao (400)
    if (usuarioMissao.id_missao == '' || usuarioMissao.id_missao == null || usuarioMissao.id_missao == undefined || isNaN(usuarioMissao.id_missao)) {
        message.ERROR_BAD_REQUEST.field = '[ID_MISSAO] INVÁLIDO' //400
        return message.ERROR_BAD_REQUEST
    } else if (usuarioMissao.id_usuario == '' || usuarioMissao.id_usuario == null || usuarioMissao.id_usuario == undefined || isNaN(usuarioMissao.id_usuario)) {
        message.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO' //400
        return message.ERROR_BAD_REQUEST
    } else
        return false
}

module.exports = {
    inserirUsuarioMissao,
    atualizarUsuarioMissao,
    buscarUsuarioMissao,
    buscarUsuarioMissaoIdMissao,
    buscarUsuarioMissaoIdUsuario,
    buscarUsuarioMissaoIdUsuarioIdMissao,
    excluirUsuarioMissao,
}