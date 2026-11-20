

const config_message = require("../modulo/configMessages.js")

const conteudoEducativoDAO = require(
    "../../model/DAO/conteudo_educativo/conteudo_educativo.js"
)

// Validar IDs
const validarId = function (id) {
    return (
        id !== undefined &&
        id !== null &&
        id !== "" &&
        Number.isInteger(Number(id)) &&
        Number(id) > 0
    )
}

// Buscar conteúdo educativo pelo ID
const buscarConteudoEducativo = async function (id, idUsuario) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if (!validarId(id) || !validarId(idUsuario)) {
            return message.ERROR_BAD_REQUEST
        }

        const result =
            await conteudoEducativoDAO.selectConteudoEducativoById(
                Number(id),
                Number(idUsuario)
            )

        if (!result) {
            return message.ERROR_NOT_FOUND
        }

        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_CREATED_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_CREATED_ITEM.status_code

        message.DEFAULT_MESSAGE.message =
            "Conteúdo educativo encontrado."

        message.DEFAULT_MESSAGE.response = result

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log("Erro ao buscar conteúdo educativo:", error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Concluir leitura do conteúdo educativo
const concluirLeitura = async function (
    id,
    idUsuario,
    dados,
    contentType
) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        // Validar IDs
        if (!validarId(id) || !validarId(idUsuario)) {
            return message.ERROR_BAD_REQUEST
        }

        // Validar Content-Type
        if (
            !String(contentType || "")
                .toUpperCase()
                .includes("APPLICATION/JSON")
        ) {
            return message.ERROR_CONTENT_TYPE
        }

        // Validar corpo da requisição
        if (
            !dados ||
            typeof dados !== "object" ||
            Array.isArray(dados)
        ) {
            return message.ERROR_BAD_REQUEST
        }

        // Validar tempo de acesso
        const tempo = Number(dados.tempo_acesso)

        if (
            dados.tempo_acesso === undefined ||
            dados.tempo_acesso === null ||
            dados.tempo_acesso === "" ||
            !Number.isFinite(tempo) ||
            tempo < 0
        ) {
            message.ERROR_BAD_REQUEST.field =
                "[TEMPO_ACESSO] INVÁLIDO"

            return message.ERROR_BAD_REQUEST
        }

        // Executar conclusão no DAO
        const result =
            await conteudoEducativoDAO.concluirConteudoEducativo(
                Number(idUsuario),
                Number(id),
                tempo
            )

        if (!result) {
            return message.ERROR_NOT_FOUND
        }

        // Preparar resposta
        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_UPDATE_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_UPDATE_ITEM.status_code

        message.DEFAULT_MESSAGE.message = result.jaConcluido
            ? "Este conteúdo já foi concluído anteriormente."
            : "Leitura concluída com sucesso!"

        message.DEFAULT_MESSAGE.response = {
            ...result,
            xpGanho: Number(result.xpGanho) || 0
        }

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log("Erro ao concluir leitura:", error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Listar conteúdos educativos com o progresso de um usuário
const listarConteudoEducativoUsuario = async function (idUsuario) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        // Validar ID do usuário
        if (!validarId(idUsuario)) {
            return message.ERROR_BAD_REQUEST
        }

        // Buscar conteúdos no DAO
        const conteudos =
            await conteudoEducativoDAO.selectTodosConteudosEducativos(
                Number(idUsuario)
            )

        if (conteudos === false) {
            return message.ERROR_INTERNAL_SERVER_CONTROLLER
        }

        message.DEFAULT_MESSAGE.status = "SUCCESS"
        message.DEFAULT_MESSAGE.status_code = 200

        message.DEFAULT_MESSAGE.message =
            "Conteúdos educativos listados com sucesso."

        message.DEFAULT_MESSAGE.response = conteudos

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log("Erro ao listar conteúdos educativos:", error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Exportar funções utilizadas pelas rotas
module.exports = {
    buscarConteudoEducativo,
    concluirLeitura,
    listarConteudoEducativoUsuario
}
