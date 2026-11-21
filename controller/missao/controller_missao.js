/*****************************************************************************
 * Objetivo: Controller de Missão
 ****************************************************************************/
const missaoDAO = require('../../model/DAO/missao/missao.js')
const controller_missao_categoria = require('./controller_missao_categoria.js')
const controller_missao_etapa = require('./controller_missao_etapa.js')

// Função para anexar categorias
const exibirCategoriasMissao = async function (result) {
    for (let missao of result) {
        let resultCategoria = await controller_missao_categoria.buscarMissaoCategoriaIdMissao(missao.id_missao)
        if (resultCategoria.status) {
            missao.categorias = resultCategoria.response.missao_categoria.map(c => c.nome_categoria)
        } else {
            missao.categorias = []
        }
    }
}

// Função para anexar etapas
const exibirEtapasMissao = async function (result) {
    for (let missao of result) {
        let resultEtapas = await controller_missao_etapa.buscarEtapasMissaoIdMissao(missao.id_missao)
        if (resultEtapas.status) {
            const progresso = Number(missao.progresso_missao) || 0
            const etapas = resultEtapas.response.etapas_missao
            const qtdConcluidas = Math.round((progresso / 100) * etapas.length)

            missao.etapas = etapas.map((e, index) => ({
                id: e.id,
                titulo: e.titulo,
                xp: e.xp,
                concluida: index < qtdConcluidas
            }))
        } else {
            missao.etapas = []
        }
    }
}

const ListarTodasMissoes = async function (id) {
    try {
        let result = await missaoDAO.selectAllMissao(id)
        if (result) {
            await exibirCategoriasMissao(result)
            await exibirEtapasMissao(result)
            return {
                status: true,
                status_code: 200,
                message: "Missões encontradas",
                response: { missoes: result }
            }
        } else {
            return { status: false, status_code: 500, message: "Erro no banco de dados" }
        }
    } catch (error) {
        console.log(error)
        return { status: false, status_code: 500, message: "Erro no controller" }
    }
}

const ListarTodasMissoesDisponiveis = async function (id) {
    try {
        let result = await missaoDAO.selectAllMissaoDisponivel(id)
        if (result) {
            await exibirCategoriasMissao(result)
            await exibirEtapasMissao(result)
            return {
                status: true,
                status_code: 200,
                message: "Missões encontradas",
                response: { missoes: result }
            }
        } else {
            return { status: false, status_code: 500, message: "Erro no banco de dados" }
        }
    } catch (error) {
        return { status: false, status_code: 500, message: "Erro no controller" }
    }
}

const ListarTodasMissoesEmAndamento = async function (id) {
    try {
        let result = await missaoDAO.selectAllMissaoAndamento(id)
        if (result) {
            await exibirCategoriasMissao(result)
            await exibirEtapasMissao(result)
            return {
                status: true,
                status_code: 200,
                message: "Missões encontradas",
                response: { missoes: result }
            }
        } else {
            return { status: false, status_code: 500, message: "Erro no banco de dados" }
        }
    } catch (error) {
        return { status: false, status_code: 500, message: "Erro no controller" }
    }
}

const ListarTodasMissoesConcluidas = async function (id) {
    try {
        let result = await missaoDAO.selectAllMissaoConcluida(id)
        if (result) {
            await exibirCategoriasMissao(result)
            await exibirEtapasMissao(result)
            return {
                status: true,
                status_code: 200,
                message: "Missões encontradas",
                response: { missoes: result }
            }
        } else {
            return { status: false, status_code: 500, message: "Erro no banco de dados" }
        }
    } catch (error) {
        return { status: false, status_code: 500, message: "Erro no controller" }
    }
}

module.exports = {
    ListarTodasMissoes,
    ListarTodasMissoesDisponiveis,
    ListarTodasMissoesEmAndamento,
    ListarTodasMissoesConcluidas
}