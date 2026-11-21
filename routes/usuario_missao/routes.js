
const express = require('express')
const router = express.Router()

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
router.post('/usuario_missao', async function (req, res) {
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

// Concluir uma missão
router.put('/usuario_missao/concluir', async function (req, res) {
    try {
        const contentType = req.headers['content-type']
        const dados = req.body

        const result = await controller.atualizarUsuarioMissao(
            dados,
            null,
            contentType
        )

        return enviarResposta(res, result)

    } catch (error) {
        console.error('Erro na rota de conclusão:', error)

        return res.status(500).json({
            status: false,
            message: 'Erro interno ao concluir a missão.'
        })
    }
})

module.exports = router
