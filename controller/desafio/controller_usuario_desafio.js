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
const usuarioDAO = require('../../model/DAO/usuario/usuario.js')
const controller_desafio_categoria = require('./controller_desafio_categoria.js')

//Criar (o usuário entra em um desafio)
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
                let validarUsuario = await verificarUsuarioExiste(usuarioDesafio.id_usuario)
                if(validarUsuario)
                    return validarUsuario //404, 500

                let result = await usuarioDesafioDAO.participarDesafio(Number(usuarioDesafio.id_usuario), Number(usuarioDesafio.id_desafio))
                if(result){
                    if(result.erro)
                        return traduzirErro(result.erro, message) //404, 409

                    //201 quando o vínculo foi criado agora; 200 quando já existia (já participava ou voltou a participar)
                    let sucesso = result.criado ? message.SUCCESS_CREATED_ITEM : message.SUCCESS_UPDATE_ITEM
                    message.DEFAULT_MESSAGE.status       = sucesso.status
                    message.DEFAULT_MESSAGE.status_code  = sucesso.status_code
                    message.DEFAULT_MESSAGE.message      = sucesso.message
                    message.DEFAULT_MESSAGE.response     = {
                        id:             result.id,
                        id_usuario:     Number(usuarioDesafio.id_usuario),
                        id_desafio:     Number(usuarioDesafio.id_desafio),
                        status:         result.status,
                        progresso:      result.progresso
                    }
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

//Atualizar (concluir, abandonar ou voltar a participar). Só o campo "status" é obrigatório no body.
//id_usuario e id_desafio, se vierem, precisam bater com o vínculo: o id da URL é quem manda
const atualizarUsuarioDesafio = async function (usuarioDesafio, id, contentType) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação do contentType para receber apenas JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            if(!idValido(id)){
                message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO' //400
                return message.ERROR_BAD_REQUEST
            }

            let dados = usuarioDesafio ?? {}
            let status = String(dados.status).toUpperCase()

            if(!STATUS_VALIDOS.includes(status)){
                message.ERROR_BAD_REQUEST.field = '[STATUS] INVÁLIDO (use EM_ANDAMENTO, CONCLUIDO ou ABANDONADO)' //400
                return message.ERROR_BAD_REQUEST
            }

            let vinculo = await usuarioDesafioDAO.selectByIdUsuarioDesafio(id)
            if(!vinculo)
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
            if(vinculo.length == 0)
                return message.ERROR_NOT_FOUND //404 (Não encontrado)

            if(dados.id_usuario != undefined && Number(dados.id_usuario) !== Number(vinculo[0].id_usuario)){
                message.ERROR_BAD_REQUEST.field = '[ID_USUARIO] NÃO PERTENCE A ESTE VÍNCULO' //400
                return message.ERROR_BAD_REQUEST
            }
            if(dados.id_desafio != undefined && Number(dados.id_desafio) !== Number(vinculo[0].id_desafio)){
                message.ERROR_BAD_REQUEST.field = '[ID_DESAFIO] NÃO PERTENCE A ESTE VÍNCULO' //400
                return message.ERROR_BAD_REQUEST
            }

            let result = await usuarioDesafioDAO.alterarStatusUsuarioDesafio(Number(id), status)
            if(result){
                if(result.erro)
                    return traduzirErro(result.erro, message) //404, 409

                message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATE_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATE_ITEM.message
                message.DEFAULT_MESSAGE.response    = result
                return message.DEFAULT_MESSAGE //200 (Atualizado)
            }else
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
        }else
            return message.ERROR_CONTENT_TYPE //415(ContentType)
    } catch (error) {
        console.log(error)
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
                await complementarDesafios(result)
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
                await complementarDesafios(result)
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
                await complementarDesafios(result)
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
            let result = await usuarioDesafioDAO.selectUsuarioDesafioByIdDesafioByIdUsuario(idUsuario, idDesafio)
            if(result){
                await complementarDesafios(result)
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
                await complementarDesafios(result)
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

//Ler (um desafio com a situação do usuário; funciona mesmo que o usuário ainda não participe dele)
const buscarDesafioDoUsuario = async function (idDesafio, idUsuario) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Validação para garantir que os ids sejam válidos
        if(!idValido(idDesafio)){
            message.ERROR_BAD_REQUEST.field = '[ID DESAFIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else if(!idValido(idUsuario)){
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO' //400
            return message.ERROR_BAD_REQUEST
        }else{
            let validarUsuario = await verificarUsuarioExiste(idUsuario)
            if(validarUsuario)
                return validarUsuario //404, 500

            let result = await usuarioDesafioDAO.selectDesafioDoUsuarioByIdUsuarioByIdDesafio(Number(idUsuario), Number(idDesafio))
            if(result){
                if(result.length > 0){
                    await complementarDesafios(result)
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
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Complementa cada desafio com as suas categorias (lista vazia quando não há) e com a
//informação de que o prazo já acabou ("encerrado"). Desafio sem data_termino nunca encerra.
const complementarDesafios = async function(result){

    //Início do dia de hoje: o desafio só está encerrado depois do dia do seu data_termino
    let hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    for(const desafios of result){
        //Cria o objeto de categorias relacionados ao desafio
        let resultCategoria = await controller_desafio_categoria.buscarDesafioCategoriaIdDesafio(desafios.id_desafio)
        desafios.categoria = resultCategoria.status ? resultCategoria.response.desafio_categoria : []

        desafios.encerrado = dataTerminoPassou(desafios.data_termino, hoje)
    }
}

//Diz se a data de término já ficou para trás. Aceita Date (o que o mysql2 devolve) ou texto "aaaa-mm-dd"
const dataTerminoPassou = function (dataTermino, hoje) {
    if(!dataTermino)
        return false

    let termino = dataTermino
    if(typeof dataTermino === 'string'){
        let [ano, mes, dia] = dataTermino.slice(0, 10).split('-').map(Number)
        termino = new Date(ano, mes - 1, dia)
    }

    return new Date(termino).getTime() < hoje.getTime()
}

//Status aceitos para um vínculo usuário-desafio (os mesmos do enum da tabela)
const STATUS_VALIDOS = ['EM_ANDAMENTO', 'CONCLUIDO', 'ABANDONADO']

//Garante que o id seja um inteiro positivo ("12" vale; "12abc", "1.5", "" e "-3" não valem)
const idValido = function (id) {
    return /^[0-9]+$/.test(String(id)) && Number(id) > 0
}

//Verifica se o usuário existe. Devolve false quando existe; quando não, devolve a mensagem de erro (404 ou 500)
const verificarUsuarioExiste = async function (idUsuario) {
    let message = JSON.parse(JSON.stringify(config_message))
    let result = await usuarioDAO.selectByIdUsuario(Number(idUsuario))
    if(!result)
        return message.ERROR_INTERNAL_SERVER_MODEL //500 (banco de dados)
    if(result.length == 0){
        message.ERROR_NOT_FOUND.field = '[ID_USUARIO] NÃO ENCONTRADO'
        return message.ERROR_NOT_FOUND //404
    }
    return false
}

//Traduz o código de erro vindo do DAO para o padrão de mensagens da API.
//O código segue junto na resposta ("codigo") para o front escolher o texto mostrado ao usuário.
const traduzirErro = function (codigoErro, message) {
    let erro

    if(codigoErro == 'DESAFIO_NAO_ENCONTRADO'){
        erro = message.ERROR_NOT_FOUND
        erro.field = '[DESAFIO] NÃO ENCONTRADO'
    }else if(codigoErro == 'USUARIO_DESAFIO_NAO_ENCONTRADO'){
        erro = message.ERROR_NOT_FOUND
        erro.field = '[USUARIO_DESAFIO] NÃO ENCONTRADO'
    }else if(codigoErro == 'DESAFIO_ENCERRADO'){
        erro = message.ERROR_CONFLICT
        erro.field = '[DESAFIO] PRAZO ENCERRADO'
    }else if(codigoErro == 'DESAFIO_JA_CONCLUIDO'){
        erro = message.ERROR_CONFLICT
        erro.field = '[DESAFIO] JÁ CONCLUÍDO'
    }else if(codigoErro == 'DESAFIO_NAO_ESTA_EM_ANDAMENTO'){
        erro = message.ERROR_CONFLICT
        erro.field = '[DESAFIO] NÃO ESTÁ EM ANDAMENTO'
    }else
        return message.ERROR_INTERNAL_SERVER_MODEL //500

    erro.codigo = codigoErro
    return erro
}

//Função de validação (não há a necessidade de exporta-la)
const validarDados = async function (usuarioDesafio) {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))

    //Sem body, usuarioDesafio vem undefined: tratamos como objeto vazio para cair na validação (400)
    let dados = usuarioDesafio ?? {}

    //Validação de dados para os atributos do usuario_desafio (400)
    if (!idValido(dados.id_desafio)) {
        message.ERROR_BAD_REQUEST.field = '[ID_DESAFIO] INVÁLIDO' //400
        return message.ERROR_BAD_REQUEST
    } else if (!idValido(dados.id_usuario)) {
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
    buscarDesafioDoUsuario,
    buscarIndividualColetivoUsuarioDesafioIdUsuario,
    excluirUsuarioDesafio,
}
