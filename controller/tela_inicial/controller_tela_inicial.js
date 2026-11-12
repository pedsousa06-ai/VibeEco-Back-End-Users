const config_message = require('../modulo/configMessages.js')
const inicioDAO = require('../../model/DAO/tela_inicial/tela_inical.js')

const buscarTelaInicial = async function (id) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        if (id == '' || id == null || id == undefined || isNaN(id)) {
            return message.ERROR_BAD_REQUEST //400
        }

        // 1º: dados do usuário (também valida se ele existe)
        let dadosUsuario = await inicioDAO.selectDadosInicioByIdUsuario(id)

        if (dadosUsuario === false)   return message.ERROR_INTERNAL_SERVER_MODEL //500
        if (dadosUsuario.length == 0) return message.ERROR_NOT_FOUND //404

        // 2º: o restante em paralelo
        let [missoes, conteudos, ofensiva, desafios, conquistas] = await Promise.all([
            inicioDAO.selectMissoesAndamentoByIdUsuario(id),
            inicioDAO.selectConteudosRecomendadosByIdUsuario(id),
            inicioDAO.selectOfensivaByIdUsuario(id),
            inicioDAO.selectDesafiosDestaque(),
            inicioDAO.selectConquistasByIdUsuario(id)
        ])

        // false = erro no banco (lista vazia é válida, não é erro)
        if ([missoes, conteudos, ofensiva, desafios, conquistas].includes(false)) {
            return message.ERROR_INTERNAL_SERVER_MODEL //500
        }

        message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
        message.DEFAULT_MESSAGE.response.tela_inicial = {
            usuario: dadosUsuario[0],
            missoes_em_andamento: missoes,
            conteudos_recomendados: conteudos,
            ofensiva: ofensiva,
            desafios_destaque: desafios,
            conquistas_recentes: conquistas
        }
        return message.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = { buscarTelaInicial }