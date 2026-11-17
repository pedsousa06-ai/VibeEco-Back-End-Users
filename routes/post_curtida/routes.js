//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

const controllerPostCurtida = require('../../controller/post/controller_post_curtida.js')

router.post('/postCurtida', bodyParserJson, async function(request, response){
    //Recebe o conteúdo dentro do body da requisição (Abrindo o envelope e guardando o conteúdo da requisição)
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerPostCurtida.inserirPostCurtida(dados, contentType)
    response.status(result.status_code)
    response.json(result)
})

router.get('/postCurtidaIdUsuario/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerPostCurtida.buscarPostCurtidaIdUsuario(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/postCurtidaIdPost/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerPostCurtida.buscarPostCurtidaIdPost(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/postCurtida/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerPostCurtida.buscarPostCurtida(id)
    response.status(result.status_code)
    response.json(result)
})

router.delete('/postCurtida', bodyParserJson, async function (request, response) {
    //Recebe o conteúdo dentro do body da requisição (Abrindo o envelope e guardando o conteúdo da requisição)
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerPostCurtida.excluirPostCurtidaByIDPostIdUsuario(dados, contentType)
    response.status(result.status_code)
    response.json(result)
})

// Exporta as rotas para o app.js
module.exports = router