//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

const controllerDesafios = require('../../controller/desafio/controller_usuario_desafio.js')

//Insere um usuario a um desafio
router.post('/usuarioDesafio', bodyParserJson, async function(request, response){
    //Recebe o conteúdo dentro do body da requisição (Abrindo o envelope e guardando o conteúdo da requisição)
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerDesafios.inserirUsuarioDesafio(dados, contentType)
    response.status(result.status_code)
    response.json(result)
})

//Atualizar um usuario desafio (status)
router.put('/usuarioDesafio/:id', bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //Recebe o id a ser atualizado
    let id = request.params.id
    //Recebe os dados enviados no corpo da requisição
    let dados = request.body
    let result = await controllerDesafios.atualizarUsuarioDesafio(dados, id, contentType)
    response.status(result.status_code)
    response.json(result)
})

//Busca todos os desafios registrados e nao registrados em um usuario
router.get('/desafios/todosUsuariosDesafiosIdUsuario/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerDesafios.buscarTodosUsuarioDesafioIdUsuario(id)
    response.status(result.status_code)
    response.json(result)
})

//Busca todos usuario registrados em um desafio
router.get('/desafios/todosUsuariosDesafiosIdDesafio/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerDesafios.buscarUsuarioDesafioIdDesafio(id)
    response.status(result.status_code)
    response.json(result)
})

//Busca um usuario_desafio pelo id do usuario e o id do desafio
router.get('/desafios/usuario/:idUsuario/desafio/:idDesafio', async function(request, response){
    //Recebe os ids pela URL
    let idUsuario = request.params.idUsuario
    let idDesafio  = request.params.idDesafio

    //Chama a controller
    let result = await controllerDesafios.buscarUsuarioDesafioIdUsuarioIdDesafio(idUsuario, idDesafio)

    response.status(result.status_code)
    response.json(result)
})

//Busca um usuario_desafio
router.get('/desafios/usuarioDesafio/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerDesafios.buscarUsuarioDesafio(id)
    response.status(result.status_code)
    response.json(result)
})

//Desafios individuais e coletivos
router.get('/desafios/usuario/:idUsuario/idTipoDesafio/:idTipoDesafio', async function(request, response){
    //Recebe os ids pela URL
    let idUsuario = request.params.idUsuario
    let idTipoDesafio  = request.params.idTipoDesafio

    //Chama a controller
    let result = await controllerDesafios.buscarIndividualColetivoUsuarioDesafioIdUsuario(idUsuario, idTipoDesafio)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/usuarioDesafio/:id', bodyParserJson, async function (request, response) {
    let id      = request.params.id
    let result  = await controllerDesafios.excluirUsuarioDesafio(id)
    response.status(result.status_code)
    response.json(result) 
})

// Exporta as rotas para o app.js
module.exports = router