/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação de dados para o CRUD
 * Data: 17.11.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const usuarioDAO = require('../../model/DAO/usuario/usuario.js')

//Atualizar
const adicionarXpCoinsUsuario = async function (usuario, id, contentType) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            if(String(contentType).toUpperCase().includes('APPLICATION/JSON')){
                let resultBuscarID = await buscarUsuario(id)
                if(resultBuscarID.status){
                    //Validação de campos obrigatórios para atualização (body)
                    let validar = await validarDados(usuario)
                    if(!validar){
                        //Adicionando o atributo ID da categoria no JSON para ser enviado ao DAO
                        usuario.id = id
                        //Chama a função do DAO para atualizar a categoria
                        let result = await usuarioDAO.incrementXpCoinsUsuario(usuario)
                        if(result){
                            message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                            message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                            message.DEFAULT_MESSAGE.response    = usuario
                            return message.DEFAULT_MESSAGE //200 (Atualizado)
                        }else
                            return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
                    }else
                        return validar
                }else
                return resultBuscarID //404, 400, 500 (resultBuscarId)
            }else
                return message.ERROR_CONTENT_TYPE //415 (retorna erro de tipo de dados) 
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Ler
const buscarUsuario = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(id == '' || id == null || id == undefined || isNaN(id)){
            message.ERROR_BAD_REQUEST //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await usuarioDAO.selectByIdUsuario(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.usuario = result //201
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
const validarDados = async function (usuario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos do post (400)
        if(usuario.total_xp == '' || usuario.total_xp == null || usuario.total_xp == undefined || isNaN(usuario.total_xp)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[TOTAL_XP] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        } else if(usuario.coins == '' || usuario.coins == null || usuario.coins == undefined || isNaN(usuario.coins)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[COINS] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else
            return false
}

module.exports = {
    adicionarXpCoinsUsuario
}