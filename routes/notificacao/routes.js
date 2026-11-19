
const express = require('express')
const router = express.Router()

const notificacaoController = require('../../controller/notificacao/controller_notificacao.js')

// Listar notificações
router.get(
    '/notificacoes/:id',
    notificacaoController.listarNotificacoes
)

// Marcar uma notificação como lida
router.put(
    '/notificacoes/:id/lida',
    notificacaoController.marcarComoLida
)

// Marcar todas as notificações como lidas
router.put(
    '/notificacoes/:id/todas-lidas',
    notificacaoController.marcarTodasComoLidas
)

// Exportar diretamente o router
module.exports = router
