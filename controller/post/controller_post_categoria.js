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
const inserirNovoPostCategoria = async function(filmeGenero) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        let validar = await validarDados(filmeGenero)
        if(validar)
            return validar //400
        else{
            let result = await postCategoriaDAO.insertFilmeGenero(filmeGenero)
            if(result){
                /*
                    Criando o atributo ID no JSON do genero e colocando
                    o ID gerado após o insert
                */
               filmeGenero.id = result
               message.DEFAULT_MESSAGE.status       = message.SUCCESS_CREATED_ITEM.status
               message.DEFAULT_MESSAGE.status_code  = message.SUCCESS_CREATED_ITEM.status_code
               message.DEFAULT_MESSAGE.message      = message.SUCCESS_CREATED_ITEM.message
               message.DEFAULT_MESSAGE.response     = filmeGenero //201
            }else
                message.ERROR_INTERNAL_SERVER_MODEL //500(banco de dados)
        }
        return message.DEFAULT_MESSAGE  //Retorno da mensagem do try
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}

//Atualizar
const atualizarPostCategoria = async function (filmeGenero, id) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let resultBuscarID = await buscarFilmeGenero(id)
            if(resultBuscarID.status){
                //Validação de campos obrigatórios para atualização (body)
                let validar = await validarDados(filmeGenero)
                if(!validar){
                    //Adicionando o atributo ID do gênero no JSON para ser enviado ao DAO
                    filmeGenero.id = id
                    //Chama a função do DAO para atualizar o gênero
                    let result = await postCategoriaDAO.updateFilmeGenero(filmeGenero)
                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response    = filmeGenero
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
const listarPostCategoria = async function () {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Chama a função do DAO para retornar a lista de todos os filmes
        let result = await postCategoriaDAO.selectAllFilmeGenero()
        //Validação para verificar se o DAO conseguiu processar os dados
        if(result){
            //Validação para verificar se existe conteúdo no array
            if(result.length > 0){
                message.DEFAULT_MESSAGE.status                      = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code                 = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count              = result.length
                message.DEFAULT_MESSAGE.response.filme_genero       = result
                return message.DEFAULT_MESSAGE
            }else
                return message.ERROR_NOT_FOUND //404 (Dados não encontrado)
        }else
            return message.ERROR_INTERNAL_SERVER_MODEL //500 (model) Erro no BD
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller) Erro no backEnd
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
            let result = await postCategoriaDAO.selectByIdFilmeGenero(id)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.filme_genero = result //201
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
const buscarPostIdCategoria = async function (idGenero) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idGenero == '' || idGenero == null || idGenero == undefined || isNaN(idGenero)){
            message.ERROR_BAD_REQUEST.field = '[ID GENÊRO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postCategoriaDAO.selectFilmesByIdGenero(idGenero)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.filme_genero = result //201
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
const buscarCategoriaIdPost = async function (idFilme) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que o id seja válido
        if(idFilme == '' || idFilme == null || idFilme == undefined || isNaN(idFilme)){
            message.ERROR_BAD_REQUEST.field = '[ID FILME] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let result = await postCategoriaDAO.selectGenerosByIdFilme(idFilme)
            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.filme_genero = result //201
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
        let resultBuscarID = await buscarFilmeGenero(id)
        if(resultBuscarID.status){
            let result = await postCategoriaDAO.deleteFilmeGenero(id)
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
const excluirCategoriasIdPost = async function (idFilme) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
            let result = await postCategoriaDAO.deleteGenerosByIdFilme(idFilme)
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
const validarDados = async function (filmeGenero) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    //Validação de dados para os atributos do gênero (400)
        if(filmeGenero.id_filme == '' || filmeGenero.id_filme == null || filmeGenero.id_filme == undefined || isNaN(filmeGenero.id_filme)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        } else if(filmeGenero.id_genero == '' || filmeGenero.id_genero == null || filmeGenero.id_genero == undefined || isNaN(filmeGenero.id_genero)){
            //Criando um atributo no clone da padronização de mensagens
            message.ERROR_BAD_REQUEST.field = '[ID_GÊNERO] INVÁLIDO' //400
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