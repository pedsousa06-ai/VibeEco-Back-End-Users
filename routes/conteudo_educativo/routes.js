
const express = require("express")
const router = express.Router()

const controllerConteudoEducativo = require(
    "../../controller/conteudo_educativo/controller_conteudo_educativo.js"
)

// Buscar conteúdo educativo pelo ID e pelo usuário
router.get(
    "/conteudoEducativo/:id/usuario/:idUsuario",
    async function(request, response) {

        const id = request.params.id
        const idUsuario = request.params.idUsuario

        const result =
            await controllerConteudoEducativo.buscarConteudoEducativo(
                id,
                idUsuario
            )

        response.status(result.status_code)
        response.json(result)
    }
)

// Concluir leitura do conteúdo educativo
router.post(
    "/conteudoEducativo/:id/usuario/:idUsuario/concluir",
    async function(request, response) {

        const id = request.params.id
        const idUsuario = request.params.idUsuario

        const result =
            await controllerConteudoEducativo.concluirLeitura(
                id,
                idUsuario,
                request.body,
                request.headers["content-type"]
            )

        response.status(result.status_code)
        response.json(result)
    }
)

// Listar conteúdos educativos com status de conclusão do usuário
router.get(
    "/conteudoEducativo/usuario/:idUsuario",
    async function(request, response) {

        const idUsuario = request.params.idUsuario

        const result =
            await controllerConteudoEducativo.listarConteudoEducativoUsuario(
                idUsuario
            )

        response.status(result.status_code)
        response.json(result)
    }
)

module.exports = router
