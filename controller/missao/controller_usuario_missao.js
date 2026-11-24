
const config_message = require('../modulo/configMessages.js')

const usuarioMissaoDAO = require('../../model/DAO/usuario_missao/usuario_missao.js')
const controllerMissaoEtapa = require('./controller_missao_etapa.js')
const controllerMissaoCategoria = require('./controller_missao_categoria.js')

// Validar ID
const validarId = function (id) {
    return id !== '' &&
        id !== null &&
        id !== undefined &&
        Number.isInteger(Number(id)) &&
        Number(id) > 0
}

// Validar dados recebidos
const validarDados = function (usuarioMissao) {
    let message = JSON.parse(JSON.stringify(config_message))

    if (!usuarioMissao || typeof usuarioMissao !== 'object') {
        message.ERROR_BAD_REQUEST.field = 'DADOS INVÁLIDOS'
        return message.ERROR_BAD_REQUEST
    }

    if (!validarId(usuarioMissao.id_missao)) {
        message.ERROR_BAD_REQUEST.field = '[ID MISSAO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST
    }

    if (!validarId(usuarioMissao.id_usuario)) {
        message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST
    }

    return false
}

// Inserir participação em uma missão
const inserirUsuarioMissao = async function (usuarioMissao, contentType) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if (!String(contentType).toLowerCase().includes('application/json')) {
            return message.ERROR_CONTENT_TYPE
        }

        const validar = validarDados(usuarioMissao)

        if (validar) {
            return validar
        }

        // Verificar se a missão já está cadastrada para o usuário
        const participacaoExistente =
            await usuarioMissaoDAO.selectByIdUsuarioByIdMissao(
                usuarioMissao.id_missao,
                usuarioMissao.id_usuario
            )

        if (!participacaoExistente) {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

        // A procedure usa LEFT JOIN:
        // status_missao NULL significa que ainda não participa.
        if (
            participacaoExistente.length > 0 &&
            participacaoExistente[0].status_missao !== null
        ) {
            message.ERROR_BAD_REQUEST.field =
                'USUÁRIO JÁ PARTICIPA DESTA MISSÃO'

            return message.ERROR_BAD_REQUEST
        }

        const result = await usuarioMissaoDAO.insertUsuarioMissao(usuarioMissao)

        if (!result) {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

        usuarioMissao.id = result

        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_CREATED_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_CREATED_ITEM.status_code

        message.DEFAULT_MESSAGE.message =
            'Participação na missão realizada com sucesso.'

        message.DEFAULT_MESSAGE.response = usuarioMissao

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log('Erro ao participar da missão:', error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Buscar participação pelo ID
const buscarUsuarioMissao = async function (id) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if (!validarId(id)) {
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        }

        const result = await usuarioMissaoDAO.selectByIdUsuarioMissao(id)

        if (!result) {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

        if (result.length === 0) {
            return message.ERROR_NOT_FOUND
        }

        await exibirCategoriasMissao(result)
        await exibirEtapasMissao(result)

        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_CREATED_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_CREATED_ITEM.status_code

        message.DEFAULT_MESSAGE.response.usuario_missao = result

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Buscar participações por missão
const buscarUsuarioMissaoIdMissao = async function (idMissao) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if (!validarId(idMissao)) {
            message.ERROR_BAD_REQUEST.field = '[ID MISSAO] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        }

        const result =
            await usuarioMissaoDAO.selectUsuarioMissaoByIdMissao(idMissao)

        if (!result) {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

        if (result.length === 0) {
            return message.ERROR_NOT_FOUND
        }

        await exibirCategoriasMissao(result)
        await exibirEtapasMissao(result)

        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_CREATED_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_CREATED_ITEM.status_code

        message.DEFAULT_MESSAGE.response.usuario_missao = result

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Buscar participações por usuário
const buscarUsuarioMissaoIdUsuario = async function (idUsuario) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if (!validarId(idUsuario)) {
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        }

        const result =
            await usuarioMissaoDAO.selectUsuarioMissaoByIdUsuario(idUsuario)

        if (!result) {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

        if (result.length === 0) {
            return message.ERROR_NOT_FOUND
        }

        await exibirCategoriasMissao(result)
        await exibirEtapasMissao(result)

        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_CREATED_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_CREATED_ITEM.status_code

        message.DEFAULT_MESSAGE.response.usuario_missao = result

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Buscar participação por usuário e missão
const buscarUsuarioMissaoIdUsuarioIdMissao = async function (idUsuario, idMissao) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        if (!validarId(idUsuario)) {
            message.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        }

        if (!validarId(idMissao)) {
            message.ERROR_BAD_REQUEST.field = '[ID MISSAO] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        }

        const result =
            await usuarioMissaoDAO.selectByIdUsuarioByIdMissao(
                idMissao,
                idUsuario
            )

        if (!result) {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

        if (result.length === 0) {
            return message.ERROR_NOT_FOUND
        }

        await exibirCategoriasMissao(result)
        await exibirEtapasMissao(result)

        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_CREATED_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_CREATED_ITEM.status_code

        message.DEFAULT_MESSAGE.response.usuario_missao = result

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Excluir participação
const excluirUsuarioMissao = async function (id) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if (!validarId(id)) {
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        }

        const result = await usuarioMissaoDAO.deleteUsuarioMissao(id)

        if (!result) {
            return message.ERROR_NOT_FOUND
        }

        message.DEFAULT_MESSAGE.status =
            message.SUCCESS_DELETED_ITEM.status

        message.DEFAULT_MESSAGE.status_code =
            message.SUCCESS_DELETED_ITEM.status_code

        message.DEFAULT_MESSAGE.message =
            message.SUCCESS_DELETED_ITEM.message

        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Anexar categorias às missões
const exibirCategoriasMissao = async function (result) {
    for (const missao of result) {
        const resultCategoria =
            await controllerMissaoCategoria.buscarMissaoCategoriaIdMissao(
                missao.id_missao
            )

        if (resultCategoria && resultCategoria.status) {
            missao.categoria =
                resultCategoria.response.missao_categoria
        }
    }
}

// Anexar etapas às missões
const exibirEtapasMissao = async function (result) {
    for (const missao of result) {
        const resultEtapas =
            await controllerMissaoEtapa.buscarEtapasMissaoIdMissao(
                missao.id_missao
            )

        if (resultEtapas && resultEtapas.status) {
            missao.etapas =
                resultEtapas.response.etapas_missao
        }
    }
}

module.exports = {
    inserirUsuarioMissao,
    buscarUsuarioMissao,
    buscarUsuarioMissaoIdMissao,
    buscarUsuarioMissaoIdUsuario,
    buscarUsuarioMissaoIdUsuarioIdMissao,
    excluirUsuarioMissao
}
