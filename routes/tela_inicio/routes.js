//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

const controllerInicio = require("../../controller/tela_inicial/controller_tela_inicial.js")

router.get('/telaInicio/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerInicio.buscarTelaInicial(id)
    response.status(result.status_code)
    response.json(result)
})

// Exporta as rotas para o app.js
module.exports = router