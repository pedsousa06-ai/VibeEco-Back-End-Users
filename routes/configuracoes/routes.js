/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelas rotas (endpoints) da tela de Configurações
 * Data: 16/11/2026
 * Autor: Riller
 * Versão: 1.0
 * 
 *******************************************************************************************************/

const express = require('express')
const router = express.Router()

// O caminho precisa sair da pasta 'configuracoes' (../), 
// sair da pasta 'routes' (../) e entrar em 'controller/usuario'
const controllerConfiguracoes = require('../../controller/usuario/controller_configuracoes.js')

// ==========================================
// ROTAS DE CONFIGURAÇÕES
// ==========================================

// GET - Retorna as configurações atuais do usuário
router.get('/configuracoes/:id', controllerConfiguracoes.buscarConfiguracoes)

// PUT - Atualiza as configurações do usuário
router.put('/configuracoes/:id', controllerConfiguracoes.atualizarConfiguracoes)

module.exports = router