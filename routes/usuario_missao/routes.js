
const express = require('express')
const router = express.Router()
const bodyParser    = require("body-parser")
//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

const controller = require('../../controller/missao/controller_usuario_missao.js')

// Resposta padronizada
const enviarResposta = function (res, result) {
    const statusCode =
        result && result.status_code
            ? result.status_code
            : 500

    return res.status(statusCode).json(
        result || {
            status: false,
            message: 'Erro desconhecido.'
        }
    )
}

// Participar de uma missão
router.post('/usuarioMissao', async function (req, res) {
    try {
        const contentType = req.headers['content-type']
        const dados = req.body

        const result = await controller.inserirUsuarioMissao(
            dados,
            contentType
        )

        return enviarResposta(res, result)

    } catch (error) {
        console.error('Erro na rota de participação:', error)

        return res.status(500).json({
            status: false,
            message: 'Erro interno ao participar da missão.'
        })
    }
})

router.get('/usuarioMissao/:id', async function(request, response){
    let id = request.params.id
    let result = await controller.buscarUsuarioMissao(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuarioMissaoIdMissao/:id', async function(request, response){
    let id = request.params.id
    let result = await controller.buscarUsuarioMissaoIdMissao(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuarioMissaoIdUsuario/:id', async function(request, response){
    let id = request.params.id
    let result = await controller.buscarUsuarioMissaoIdUsuario(id)
    response.status(result.status_code)
    response.json(result)
})

router.get('/usuario/:id_usuario/missao/:id_missao', async function(request, response){
    let id_usuario = request.params.id_usuario
    let id_missao = request.params.id_missao
    let result = await controller.buscarUsuarioMissaoIdUsuarioIdMissao(id_usuario, id_missao)
    response.status(result.status_code)
    response.json(result)
})

router.delete('/usuarioMissao/:id', bodyParserJson, async function (request, response) {
    let id      = request.params.id
    let result  = await controller.excluirUsuarioMissao(id)
    response.status(result.status_code)
    response.json(result) 
})

module.exports = router
