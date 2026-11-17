//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

const controllerRanking = require('../../controller/ranking/ranking.js')

//ranking
router.get('/ranking', async function(request, response){
    let result = await controllerRanking.listarRanking()
    response.status(result.status_code)
    response.json(result)
})

router.put('/ranking/:id', bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //Recebe o id a ser atualizado
    let id = request.params.id
    //Recebe os dados enviados no corpo da requisição
    let dados = request.body
    let result = await controllerRanking.atualizarRanking(dados, id, contentType)
    response.status(result.status_code)
    response.json(result)
})

// Exporta as rotas para o app.js
module.exports = router