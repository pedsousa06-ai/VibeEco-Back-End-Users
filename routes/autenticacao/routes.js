const express = require('express')
const router = express.Router()
const controller = require('../../controller/autenticacao/controller_autenticacao.js')

const enviar = (res, result) => res.status(result.status_code).json(result)

router.post('/auth/login', async (req, res) => enviar(res, await controller.login(req.body)))
router.get('/auth/me', async (req, res) => {
    if (!req.usuarioId) return enviar(res, { status: false, status_code: 401, message: 'Faça login para continuar.', codigo: 'NAO_AUTENTICADO' })
    return enviar(res, await controller.me(req.usuarioId))
})
router.post('/auth/recuperarAcesso', async (req, res) => enviar(res, await controller.recuperarAcesso(req.body)))
router.post('/auth/validarCodigo', async (req, res) => enviar(res, await controller.validarCodigo(req.body)))
router.post('/auth/redefinirSenha', async (req, res) => enviar(res, await controller.redefinirSenha(req.body)))
router.post('/auth/primeiroAcesso', async (req, res) => enviar(res, await controller.primeiroAcesso(req.body)))

module.exports = router
