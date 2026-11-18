/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelas rotas (endpoints) do histórico do usuário
 * Data: 16/11/2026
 * Autor: Riller
 * Versão: 1.0
 * 
 *******************************************************************************************************/

const express = require('express')
const router = express.Router()

// Sobe de historico/ para routes/, sai de routes/ para a raiz, e entra em controller/historico/
const controllerHistorico = require('../../controller/historico/controller_historico.js')
router.get('/historico/:id', controllerHistorico.buscarHistorico)

module.exports = router