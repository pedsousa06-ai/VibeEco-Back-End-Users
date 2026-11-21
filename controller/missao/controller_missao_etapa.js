/*****************************************************************************
 * Objetivo: Controller de Etapas da Missão
 ****************************************************************************/
const config_message = require('../modulo/configMessages.js')
const missaoEtapaDAO = require('../../model/DAO/missao_etapa/missao_etapa.js')

const buscarEtapasMissaoIdMissao = async function (idMissao) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        if (idMissao == '' || idMissao == null || idMissao == undefined || isNaN(idMissao)) {
            message.ERROR_BAD_REQUEST.field = '[ID MISSAO] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        } else {
            let result = await missaoEtapaDAO.selectMissaoEtapaByIdMissao(idMissao)
            if (result) {
                if (result.length > 0) {
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    // Retorna o array de etapas direto
                    message.DEFAULT_MESSAGE.response.etapas_missao = result 
                    return message.DEFAULT_MESSAGE
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarEtapaMissao = async function (idEtapa) {
    let message = JSON.parse(JSON.stringify(config_message))
    try {
        if (idEtapa == '' || idEtapa == null || idEtapa == undefined || isNaN(idEtapa)) {
            message.ERROR_BAD_REQUEST.field = '[ID ETAPA] INVÁLIDO'
            return message.ERROR_BAD_REQUEST
        } else {
            let result = await missaoEtapaDAO.selectByIdMissaoEtapa(idEtapa)
            if (result) {
                if (result.length > 0) {
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.response.etapas_missao = result
                    return message.DEFAULT_MESSAGE
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    buscarEtapasMissaoIdMissao,
    buscarEtapaMissao
}