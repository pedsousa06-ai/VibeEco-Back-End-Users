/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e manipulação
   de dados para o ranking
 * Data: 16.11.2026
 * Autor: Riller
 * Versão: 1.0
 ****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do post no banco de dados
const missaoDAO  = require('../../model/DAO/missao/missao.js')
const usuarioDAO = require('../../model/DAO/usuario/usuario.js')
const controller_missao_categoria = require('./controller_missao_categoria.js')

//Ler
const ListarTodasMissoes = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validarUsuario = await buscarIdUsuario(id)
        if(validarUsuario.status){
            let result = await missaoDAO.selectAllMissao(id)
            if(result){
                await exibirCategoriasMissao(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.missoes = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
        }else
            return validarUsuario
    } catch (error) {
        console.log(error)
       return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

//Ler
const ListarTodasMissoesDisponiveis = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validarUsuario = await buscarIdUsuario(id)
        if(validarUsuario.status){
            let result = await missaoDAO.selectAllMissaoDisponivel(id)
            if(result){
                await exibirCategoriasMissao(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.missoes = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
        }else
            return validarUsuario
    } catch (error) {
       return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

//Ler
const ListarTodasMissoesEmAndamento = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validarUsuario = await buscarIdUsuario(id)
        if(validarUsuario.status){
            let result = await missaoDAO.selectAllMissaoAndamento(id)
            if(result){
                await exibirCategoriasMissao(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.missoes = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
        }else
            return validarUsuario
    } catch (error) {
       return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

//Ler
const ListarTodasMissoesConcluidas = async function (id) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validarUsuario = await buscarIdUsuario(id)
        if(validarUsuario.status){
            let result = await missaoDAO.selectAllMissaoConcluida(id)
            if(result){
                await exibirCategoriasMissao(result)
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.missoes = result //201
                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND //404 (Não encontrado)
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            }
        }else
            return validarUsuario
    } catch (error) {
       return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
}

//Ler
const buscarIdUsuario = async function (id) {
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
                    message.DEFAULT_MESSAGE.response.exibir_missoes = result //201
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

const exibirCategoriasMissao = async function(result){
    for(missoes of result){
        //Cria o objeto de categorias relacionados ao post
        let resultCategoria = await controller_missao_categoria.buscarMissaoCategoriaIdMissao(missoes.id_missao)
        if(resultCategoria.status){
            missoes.categoria = resultCategoria.response.missao_categoria
        }
    }
}

module.exports = {
    ListarTodasMissoes, 
    ListarTodasMissoesDisponiveis, 
    ListarTodasMissoesEmAndamento, 
    ListarTodasMissoesConcluidas
}