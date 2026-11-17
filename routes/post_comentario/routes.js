//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

const controllerPostComentario = require('../../controller/post/controller_post_comentario')

router.post('/postComentario', bodyParserJson, async function(request, response){
    //Recebe o conteúdo dentro do body da requisição (Abrindo o envelope e guardando o conteúdo da requisição)
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerPostComentario.inserirPostComentario(dados, contentType)
    response.status(result.status_code)
    response.json(result)
})

router.get('/postComentarioIdUsuario/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerPostComentario.buscarPostComentarioIdUsuario(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/postComentarioIdPost/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerPostComentario.buscarPostComentarioIdPost(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/postComentario/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerPostComentario.buscarPostComentario(id)
    response.status(result.status_code)
    response.json(result)
})

router.put('/postComentario/:id', bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //Recebe o id a ser atualizado
    let id = request.params.id
    //Recebe os dados enviados no corpo da requisição
    let dados = request.body
    let result = await controllerPostComentario.atualizarPostComentario(dados, id, contentType)
    response.status(result.status_code)
    response.json(result)
})

router.delete('/postComentario/:id', bodyParserJson, async function (request, response) {
    let id      = request.params.id
    let result  = await controllerPostComentario.excluirPostComentario(id)
    response.status(result.status_code)
    response.json(result) 
})

// Exporta as rotas para o app.js
module.exports = router