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

//Import das controllers
const controller_post_categoria     = require('./controller_post_categoria.js')
const controller_post_comentario    = require('./controller_post_comentario.js')
const controller_post_anexo         = require('./controller_post_anexo.js')
const controller_anexo              = require('../anexo/controller_anexo.js')   

//Criar
const inserirNovoPost = async function(post, contentType, arquivos = []) {

    let message = JSON.parse(JSON.stringify(config_message))

    try {

        // CORREÇÃO: Se a categoria vier como string do form-data, converte para array/objeto real
        if (typeof post.categoria === 'string') {
            try {
                post.categoria = JSON.parse(post.categoria)
            } catch (error) {
                message.ERROR_BAD_REQUEST.field = '[CATEGORIA] INVÁLIDA (Formato JSON incorreto)'
                return message.ERROR_BAD_REQUEST
            }
        }

        // 1. Validar os dados recebidos
        let validar = await validarDados(post, contentType)

        if(validar)
            return validar

        // 2. Inserir o post no banco
        let result = await postDAO.insertNewPost(post)

        if(!result)
            return message.ERROR_INTERNAL_SERVER_MODEL

        // Recuperar o ID gerado
        post.id = result

        // 3. Inserir categorias, caso existam OBS: Converter o tipo text para array
        if(post.categoria && Array.isArray(post.categoria)) {

            for(const categoria of post.categoria) {

                let postCategoria = {
                    id_post: post.id,
                    id_categoria: categoria.id
                }

                let resultInsertCategoria =
                    await controller_post_categoria.inserirNovoPostCategoria(postCategoria)

                if(!resultInsertCategoria.status)
                    return message.SUCCESS_CREATED_ITEM_WARNING
            }
        }

        // 4. Inserir os anexos, caso existam
        let anexosInseridos = []

        for(const arquivo of arquivos) {

            // Criar objeto com os dados do anexo
            let anexo = {
                nome: arquivo.originalname
            }

            // 5. Inserir anexo (upload Azure + TBL_ANEXO)
            let resultAnexo = await controller_anexo.inserirNovoAnexo(
                contentType,
                anexo,
                arquivo
            )

            // Verificar se o anexo foi inserido
            if(!resultAnexo.status) {
                console.log("Erro ao inserir anexo")
                return message.SUCCESS_CREATED_ITEM_WARNING
            }

            // Recuperar ID do anexo
            let idAnexo = resultAnexo.response.id

            // 6. Criar relacionamento na TBL_POST_ANEXO
            let postAnexo = {
                id_post: post.id,
                id_anexo: idAnexo
            }

            //O erro comeca aqui
            let resultPostAnexo =
                await controller_post_anexo.inserirNovoPostAnexo(postAnexo)

            if(!resultPostAnexo.status) {
                console.log("Erro ao relacionar anexo com post")
                return message.SUCCESS_CREATED_ITEM_WARNING
            }

            // Guardar os dados para retornar ao usuário
            anexosInseridos.push(resultAnexo.response)
        }

        // 7. Preparar resposta
        post.anexo = anexosInseridos

        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_CREATED_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_CREATED_ITEM.status_code

        message.DEFAULT_MESSAGE.message =
            message.SUCCESS_CREATED_ITEM.message

        message.DEFAULT_MESSAGE.response = post

        return message.DEFAULT_MESSAGE

    } catch(error) {

        console.log(error)

        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Atualizar
const atualizarPost = async function (post, id, contentype) {
    //Criando um clone do objeto JSON para manipular sua estrutura sem modificar o arquivo original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        // CORREÇÃO: Se a categoria vier como string do form-data, converte para array/objeto real
        if (typeof post.categoria === 'string') {
            try {
                post.categoria = JSON.parse(post.categoria)
            } catch (error) {
                message.ERROR_BAD_REQUEST.field = '[CATEGORIA] INVÁLIDA (Formato JSON incorreto)'
                return message.ERROR_BAD_REQUEST
            }
        }
        //Validação do contentType para receber formato de dados em JSON
        if(type.includes('APPLICATION/JSON') || type.includes('MULTIPART/FORM-DATA')){
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

                        //Manipulação de dados na tabela de relação entre post e categoria
                        let resultDeleteCategoria = await controller_post_categoria.excluirCategoriaIdPost(post.id)
                        //Após a exclusão de todos as categorias com o post
                        if(resultDeleteCategoria.status){
                            //Manipulação de dados para inserir as categorias do post
                            for(categoria of post.categoria){
                                //Cria o objeto JSON com o id do filme e o id do gênero
                                let postCategoria = {
                                "id_post": post.id,
                                "id_categoria": categoria.id
                                }
                                //Chama a controller do post_categoria para inserir os IDs
                                let resultInsertCategoria = await controller_post_categoria.inserirNovoPostCategoria(postCategoria)
                                if(!resultInsertCategoria)
                                    return message.SUCCESS_CREATED_ITEM_WARNING //201 (ok, porém com WARNING)
                            }
                        }

                        //Manipulação de dados na tabela de relação entre post e categoria
                        let resultDeleteAnexo = await controller_post_anexo.excluirAnexosIdPost(post.id)
                        //Após a exclusão de todos as categorias com o post
                        if(resultDeleteAnexo.status){
                            //Manipulação de dados para inserir as categorias do post
                            for(anexo of post.anexo){
                                //Cria o objeto JSON com o id do filme e o id do gênero
                                let postAnexo = {
                                "id_post": post.id,
                                "id_anexo": anexo.id
                                }
                                //Chama a controller do post_categoria para inserir os IDs
                                let resultInsertAnexo = await controller_post_anexo.inserirNovoPostAnexo(postAnexo)
                                if(!resultInsertAnexo)
                                    return message.SUCCESS_CREATED_ITEM_WARNING //201 (ok, porém com WARNING)
                            }
                        }

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
        //console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}   

//Ler os posts mais recentes
const listarPost = async function () {
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        //Chama a função do DAO para retornar a lista de todos os posts
        let result = await postDAO.selectAllPost()
        //Validação para verificar se o DAO conseguiu processar os dados
        if(result){
            for(post of result){
                //Cria o objeto de categorias relacionados ao post
                let resultCategoria = await controller_post_categoria.buscarCategoriasIdPost(post.id)
                if(resultCategoria.status){
                    post.categoria = resultCategoria.response.post_categoria
                }
            }
            for(post of result){
                //Cria o objeto de categorias relacionados ao post
                let resultComentario = await controller_post_comentario.buscarPostComentarioIdPost(post.id)
                if(resultComentario.status){
                    post.comentario = resultComentario.response.post_comentario
                }
            }
            for(post of result){
                //Cria o objeto de categorias relacionados ao post
                let resultAnexo = await controller_post_anexo.buscarAnexosIdPost(post.id)
                if(resultAnexo.status){
                    post.anexo = resultAnexo.response.post_anexo
                }
            }
            //Validação para verificar se existe conteúdo no array
            if(result.length > 0){
                message.DEFAULT_MESSAGE.status              = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code         = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count      = result.length
                message.DEFAULT_MESSAGE.response.post       = result
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
                for(post of result){
                    //Cria o objeto de categorias relacionados ao post
                    let resultCategoria = await controller_post_categoria.buscarCategoriasIdPost(post.id)
                    if(resultCategoria.status){
                        post.categoria = resultCategoria.response.post_categoria
                    }
                }
                for(post of result){
                    //Cria o objeto de categorias relacionados ao post
                    let resultComentario = await controller_post_comentario.buscarPostComentarioIdPost(post.id)
                    if(resultComentario.status){
                        post.comentario = resultComentario.response.post_comentario
                    }
                }
                for(post of result){
                    //Cria o objeto de categorias relacionados ao post
                    let resultAnexo = await controller_post_anexo.buscarAnexosIdPost(post.id)
                    if(resultAnexo.status){
                        post.anexo = resultAnexo.response.post_anexo
                    }
                }
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
                    for(post of result){
                        //Cria o objeto de categorias relacionados ao post
                        let resultCategoria = await controller_post_categoria.buscarCategoriasIdPost(post.id)
                        if(resultCategoria.status){
                            post.categoria = resultCategoria.response.post_categoria
                        }
                    }
                    for(post of result){
                        //Cria o objeto de categorias relacionados ao post
                        let resultComentario = await controller_post_comentario.buscarPostComentarioIdPost(post.id)
                        if(resultComentario.status){
                            post.comentario = resultComentario.response.post_comentario
                        }
                    }
                    for(post of result){
                        //Cria o objeto de categorias relacionados ao post
                        let resultAnexo = await controller_post_anexo.buscarAnexosIdPost(post.id)
                        if(resultAnexo.status){
                            post.anexo = resultAnexo.response.post_anexo
                        }
                    }
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
    let message = JSON.parse(JSON.stringify(config_message))
    let type = String(contentType).toUpperCase()

    // Usando .includes() para aceitar o multipart/form-data mesmo com o boundary
    if(type.includes('APPLICATION/JSON') || type.includes('MULTIPART/FORM-DATA')){
        if(post.descricao == '' || post.descricao == null || post.descricao == undefined || post.descricao.length <= 0){
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