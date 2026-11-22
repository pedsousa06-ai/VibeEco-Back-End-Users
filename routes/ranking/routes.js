
const express = require('express')
const controllerRanking = require('../../controller/ranking/controller_ranking.js')

const router = express.Router()

// RANKING GERAL
router.get('/ranking', async (req, res) => {
  try {
    const resultado = await controllerRanking.listarRanking()
    return res.status(resultado.status_code).json(resultado)
  } catch (error) {
    console.error('GET /ranking:', error)

    return res.status(500).json({
      status_code: 500,
      status: false,
      message: 'Erro interno ao consultar ranking.',
      response: {}
    })
  }
})

// RANKING DA INSTITUIÇÃO
router.get('/ranking/instituicao/:id', async (req, res) => {
  try {
    const resultado = await controllerRanking.listarRankingInstituicao(
      req.params.id
    )

    return res.status(resultado.status_code).json(resultado)
  } catch (error) {
    console.error('GET /ranking/instituicao:', error)

    return res.status(500).json({
      status_code: 500,
      status: false,
      message: 'Erro interno ao consultar ranking da instituição.',
      response: {}
    })
  }
})

// RANKING DO GRUPO
router.get('/ranking/grupo/:id', async (req, res) => {
  try {
    const resultado = await controllerRanking.listarRankingGrupo(
      req.params.id
    )

    return res.status(resultado.status_code).json(resultado)
  } catch (error) {
    console.error('GET /ranking/grupo:', error)

    return res.status(500).json({
      status_code: 500,
      status: false,
      message: 'Erro interno ao consultar ranking do grupo.',
      response: {}
    })
  }
})

// ALTERAR VISIBILIDADE NO RANKING
router.put('/ranking/:id', express.json(), async (req, res) => {
  try {
    const resultado = await controllerRanking.atualizarRanking(
      req.body,
      req.params.id,
      req.headers['content-type']
    )

    return res.status(resultado.status_code).json(resultado)
  } catch (error) {
    console.error('PUT /ranking:', error)

    return res.status(500).json({
      status_code: 500,
      status: false,
      message: 'Erro interno ao atualizar ranking.',
      response: {}
    })
  }
})

module.exports = router
