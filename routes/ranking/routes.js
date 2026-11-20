// routes/ranking/router_ranking.js
const express = require('express')
const controllerRanking = require('../../controller/ranking/controller_ranking.js')

const router = express.Router()

router.get('/ranking', async (request, response) => {
  try {
    const resultado = await controllerRanking.listarRanking()
    return response.status(resultado.status_code).json(resultado)
  } catch (error) {
    console.error('GET /ranking:', error)
    return response.status(500).json({
      status_code: 500,
      status: false,
      message: 'Erro interno ao consultar o ranking.',
      response: {}
    })
  }
})

router.put('/ranking/:id', express.json(), async (request, response) => {
  try {
    const resultado = await controllerRanking.atualizarRanking(
      request.body,
      request.params.id,
      request.headers['content-type']
    )
    return response.status(resultado.status_code).json(resultado)
  } catch (error) {
    console.error('PUT /ranking/:id:', error)
    return response.status(500).json({
      status_code: 500,
      status: false,
      message: 'Erro interno ao atualizar o ranking.',
      response: {}
    })
  }
})

module.exports = router
