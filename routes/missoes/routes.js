//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

const controllerMissoes = require('../../controller/missao/controller_missao.js')

//Todas as missoes
router.get('/missoes/todasmissoes/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerMissoes.ListarTodasMissoes(id)
    response.status(result.status_code)
    response.json(result)
})

//Todas as missoes disponiveis
router.get('/missoes/missoesDisponiveis/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerMissoes.ListarTodasMissoesDisponiveis(id)
    response.status(result.status_code)
    response.json(result)
})

//Todas as missoes em andamento
router.get('/missoes/missoesAndamento/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerMissoes.ListarTodasMissoesEmAndamento(id)
    response.status(result.status_code)
    response.json(result)
})

//Todas as missoes concluidas
router.get('/missoes/missoesConcluidas/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerMissoes.ListarTodasMissoesConcluidas(id)
    response.status(result.status_code)
    response.json(result)
})

// Exporta as rotas para o app.js
module.exports = router