const express = require("express")
const bodyParser = require("body-parser")
const bodyParserJson = bodyParser.json()
const router = express.Router()

const controllerPerfil = require('../../controller/perfil/controller_perfil.js')

// Perfil completo: dados, desempenho, evolução de XP e conquistas
router.get('/perfil/:id', async function (request, response) {
    let result = await controllerPerfil.buscarPerfil(request.params.id)
    response.status(result.status_code)
    response.json(result)
})

// Edição do perfil (nome, nomePublico, curso, localizacao, bio)
router.put('/perfil/:id', bodyParserJson, async function (request, response) {
    let result = await controllerPerfil.atualizarPerfil(request.params.id, request.body, request.headers['content-type'])
    response.status(result.status_code)
    response.json(result)
})

module.exports = router
