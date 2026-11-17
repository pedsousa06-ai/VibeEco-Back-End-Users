//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

const controllerUsuarioMissao = require("../../controller/missao/controller_usuario_missao.js")

router.post('/usuarioMissao', bodyParserJson, async function(request, response){
    //Recebe o conteúdo dentro do body da requisição (Abrindo o envelope e guardando o conteúdo da requisição)
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerUsuarioMissao.inserirUsuarioMissao(dados, contentType)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuarioMissaoIdMissao/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerUsuarioMissao.buscarUsuarioMissaoIdMissao(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuarioMissaoIdUsuario/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerUsuarioMissao.buscarUsuarioMissaoIdUsuario(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuarioMissao/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerUsuarioMissao.buscarUsuarioMissao(id)
    response.status(result.status_code)
    response.json(result)
})

//Retorna a missão de um usuário específico
router.get('/usuario/:idUsuario/missao/:idMissao', async function(request, response){
    //Recebe os ids pela URL
    let idUsuario = request.params.idUsuario
    let idMissao  = request.params.idMissao

    //Chama a controller
    let result = await controllerUsuarioMissao.buscarUsuarioMissaoIdUsuarioIdMissao(idUsuario, idMissao)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/usuarioMissao/:id', bodyParserJson, async function (request, response) {
    let id      = request.params.id
    let result  = await controllerUsuarioMissao.excluirUsuarioMissao(id)
    response.status(result.status_code)
    response.json(result) 
})

// Exporta as rotas para o app.js
module.exports = router