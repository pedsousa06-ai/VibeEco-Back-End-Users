/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação de dados para o CRUD
 * Data: 17.11.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const usuarioEtapaDAO = require('../../model/DAO/usuario_etapa/usuario_etapa.js')

//Traduz o texto de erro da procedure para o padrão de mensagens da API
const traduzirErro = function(textoErro, message){
    if(textoErro.includes('ETAPA_NAO_ENCONTRADA')){
        message.ERROR_NOT_FOUND.field = '[ID_ETAPA] ETAPA NÃO ENCONTRADA'
        return message.ERROR_NOT_FOUND //404
    }else if(textoErro.includes('USUARIO_NAO_VINCULADO_A_MISSAO')){
        message.ERROR_NOT_FOUND.field = '[ID_USUARIO] USUÁRIO NÃO ACEITOU ESTA MISSÃO'
        return message.ERROR_NOT_FOUND //404
    }else if(textoErro.includes('MISSAO_NAO_ESTA_EM_ANDAMENTO')){
        message.ERROR_CONFLICT.field = '[MISSAO] NÃO ESTÁ EM ANDAMENTO'
        return message.ERROR_CONFLICT //409
    }else if(textoErro.includes('MISSAO_EXPIRADA')){
        message.ERROR_CONFLICT.field = '[MISSAO] PRAZO ENCERRADO'
        return message.ERROR_CONFLICT //409
    }else if(textoErro.includes('Duplicate entry') || textoErro.includes('1062')){
        message.ERROR_CONFLICT.field = '[ETAPA] JÁ CONCLUÍDA'
        return message.ERROR_CONFLICT //409
    }else
        return message.ERROR_INTERNAL_SERVER_MODEL //500
}

//Criar (conclui a etapa)
const inserirUsuarioEtapa = async function(usuarioEtapa, contentType) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //validando content type
        if(String(contentType).toUpperCase().includes('APPLICATION/JSON')){
            //Valida o formato dos dados (400)
            let validar = await validarDados(usuarioEtapa)
            if(validar)
                return validar

            //A procedure faz as validações de negócio, as gravações e as recompensas
            let result = await usuarioEtapaDAO.concluirEtapa(usuarioEtapa.id_usuario, usuarioEtapa.id_etapa)

            if(result.erro)
                return traduzirErro(result.erro, message)
            usuarioEtapa.id = result[0].id
            usuarioEtapa.progresso = result[0].progresso
            usuarioEtapa.status = result[0].status
            message.DEFAULT_MESSAGE.status      = message.SUCCESS_CREATED_ITEM.status
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
            message.DEFAULT_MESSAGE.message     = message.SUCCESS_CREATED_ITEM.message
            message.DEFAULT_MESSAGE.response    = usuarioEtapa
            return message.DEFAULT_MESSAGE //201
        }else
            return message.ERROR_CONTENT_TYPE //415 (retorna erro de tipo de dados) 
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Ler
const buscarUsuarioEtapa = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioEtapaDAO.selectByIdUsuarioEtapa(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_etapa = result //201
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
const buscarUsuarioEtapaIdEtapa = async function (idEtapa) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idEtapa == '' || idEtapa == null || idEtapa == undefined || isNaN(idEtapa)){
            message.ERROR_BAD_REQUEST.field = '[ID ETAPA] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioEtapaDAO.selectUsuarioByIdEtapa(idEtapa)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_etapa = result //201
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
const buscarUsuarioEtapaIdUsuario = async function (idUsuario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idUsuario == '' || idUsuario == null || idUsuario == undefined || isNaN(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioEtapaDAO.selectEtapaByIdUsuario(idUsuario)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario_etapa = result //201
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
const validarDados = async function (usuarioEtapa) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos do post (400)
        if(usuarioEtapa.id_etapa == '' || usuarioEtapa.id_etapa == null || usuarioEtapa.id_etapa == undefined || isNaN(usuarioEtapa.id_etapa)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_ETAPA] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        } else if(usuarioEtapa.id_usuario == '' || usuarioEtapa.id_usuario == null || usuarioEtapa.id_usuario == undefined || isNaN(usuarioEtapa.id_usuario)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else
            return false
}

module.exports = {
    inserirUsuarioEtapa,
    buscarUsuarioEtapa,
    buscarUsuarioEtapaIdEtapa,
    buscarUsuarioEtapaIdUsuario
}