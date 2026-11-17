//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

const controllerUsuarioEtapa = require("../../controller/usuario/controller_usuario_etapa.js")

router.post('/usuarioEtapa', bodyParserJson, async function(request, response){
    //Recebe o conteúdo dentro do body da requisição (Abrindo o envelope e guardando o conteúdo da requisição)
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerUsuarioEtapa.inserirUsuarioEtapa(dados, contentType)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuarioEtapa/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerUsuarioEtapa.buscarUsuarioEtapa(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuarioEtapaIdEtapa/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerUsuarioEtapa.buscarUsuarioEtapaIdEtapa(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuarioEtapaIdUsuario/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerUsuarioEtapa.buscarUsuarioEtapaIdUsuario(id)
    response.status(result.status_code)
    response.json(result)
})

// Exporta as rotas para o app.js
module.exports = router