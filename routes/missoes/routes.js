
const express = require('express')
const router = express.Router()

const controllerMissoes = require('../../controller/missao/controller_missao.js')

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

// Todas as missões
router.get('/missoes/todasmissoes/:id', async function (request, response) {
    try {
        const id = request.params.id

        const result = await controllerMissoes.ListarTodasMissoes(id)

        return enviarResposta(response, result)

    } catch (error) {
        console.error('Erro ao listar todas as missões:', error)

        return response.status(500).json({
            status: false,
            message: 'Erro interno.'
        })
    }
})

// Missões disponíveis
router.get('/missoes/missoesDisponiveis/:id', async function (request, response) {
    try {
        const id = request.params.id

        const result =
            await controllerMissoes.ListarTodasMissoesDisponiveis(id)

        return enviarResposta(response, result)

    } catch (error) {
        console.error('Erro ao listar missões disponíveis:', error)

        return response.status(500).json({
            status: false,
            message: 'Erro interno.'
        })
    }
})

// Missões em andamento
router.get('/missoes/missoesAndamento/:id', async function (request, response) {
    try {
        const id = request.params.id

        const result =
            await controllerMissoes.ListarTodasMissoesEmAndamento(id)

        return enviarResposta(response, result)

    } catch (error) {
        console.error('Erro ao listar missões em andamento:', error)

        return response.status(500).json({
            status: false,
            message: 'Erro interno.'
        })
    }
})

// Missões concluídas
router.get('/missoes/missoesConcluidas/:id', async function (request, response) {
    try {
        const id = request.params.id

        const result =
            await controllerMissoes.ListarTodasMissoesConcluidas(id)

        return enviarResposta(response, result)

    } catch (error) {
        console.error('Erro ao listar missões concluídas:', error)

        return response.status(500).json({
            status: false,
            message: 'Erro interno.'
        })
    }
})

module.exports = router
