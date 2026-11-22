
const rankingDAO = require('../../model/DAO/ranking/ranking.js')

function resposta(status_code, status, message, response = {}) {
  return {
    status_code,
    status,
    message,
    response
  }
}

function idValido(id) {
  return /^\d+$/.test(String(id)) && Number(id) > 0
}

// RANKING GERAL
async function listarRanking() {
  try {
    const ranking = await rankingDAO.selectAllRanking()

    if (ranking === false) {
      return resposta(500, false, 'Não foi possível consultar o ranking.')
    }

    return resposta(200, true, 'Ranking consultado com sucesso.', {
      ranking
    })
  } catch (error) {
    console.error('Erro ao listar ranking geral:', error)
    return resposta(500, false, 'Erro interno ao consultar ranking.')
  }
}

// RANKING POR INSTITUIÇÃO
async function listarRankingInstituicao(idUsuario) {
  try {
    if (!idValido(idUsuario)) {
      return resposta(400, false, 'ID de usuário inválido.')
    }

    const ranking = await rankingDAO.selectRankingPorInstituicao(
      Number(idUsuario)
    )

    if (ranking === false) {
      return resposta(500, false, 'Erro ao consultar ranking da instituição.')
    }

    return resposta(200, true, 'Ranking da instituição consultado.', {
      ranking
    })
  } catch (error) {
    console.error('Erro ao listar ranking da instituição:', error)
    return resposta(500, false, 'Erro interno ao consultar ranking da instituição.')
  }
}

// RANKING POR GRUPO
async function listarRankingGrupo(idUsuario) {
  try {
    if (!idValido(idUsuario)) {
      return resposta(400, false, 'ID de usuário inválido.')
    }

    const ranking = await rankingDAO.selectRankingPorGrupo(
      Number(idUsuario)
    )

    if (ranking === false) {
      return resposta(500, false, 'Erro ao consultar ranking do grupo.')
    }

    return resposta(200, true, 'Ranking do grupo consultado.', {
      ranking
    })
  } catch (error) {
    console.error('Erro ao listar ranking do grupo:', error)
    return resposta(500, false, 'Erro interno ao consultar ranking do grupo.')
  }
}

// BUSCAR USUÁRIO
async function buscarRankingId(id) {
  try {
    if (!idValido(id)) {
      return resposta(400, false, 'ID de usuário inválido.')
    }

    const usuario = await rankingDAO.selectByIdUsuario(Number(id))

    if (usuario === false) {
      return resposta(500, false, 'Erro ao consultar usuário.')
    }

    if (!Array.isArray(usuario) || usuario.length === 0) {
      return resposta(404, false, 'Usuário não encontrado.')
    }

    return resposta(200, true, 'Usuário encontrado.', {
      usuario: usuario[0]
    })
  } catch (error) {
    console.error('Erro ao buscar usuário do ranking:', error)
    return resposta(500, false, 'Erro interno ao consultar usuário.')
  }
}

// ATUALIZAR VISIBILIDADE
async function atualizarRanking(dados, id, contentType) {
  try {
    if (!String(contentType || '').toLowerCase().includes('application/json')) {
      return resposta(415, false, 'Envie o conteúdo como application/json.')
    }

    if (!idValido(id)) {
      return resposta(400, false, 'ID de usuário inválido.')
    }

    if (!dados || typeof dados.exibir_ranking !== 'boolean') {
      return resposta(
        400,
        false,
        'O campo exibir_ranking deve ser true ou false.'
      )
    }

    const usuario = await rankingDAO.selectByIdUsuario(Number(id))

    if (usuario === false) {
      return resposta(500, false, 'Erro ao consultar usuário.')
    }

    if (!Array.isArray(usuario) || usuario.length === 0) {
      return resposta(404, false, 'Usuário não encontrado.')
    }

    const resultado = await rankingDAO.updateVisibilidadeRanking({
      id: Number(id),
      exibir_ranking: dados.exibir_ranking
    })

    if (resultado === false) {
      return resposta(500, false, 'Não foi possível atualizar a visibilidade.')
    }

    return resposta(200, true, 'Visibilidade atualizada.', {
      id: Number(id),
      exibir_ranking: dados.exibir_ranking
    })
  } catch (error) {
    console.error('Erro ao atualizar visibilidade do ranking:', error)
    return resposta(500, false, 'Erro interno ao atualizar visibilidade.')
  }
}

module.exports = {
  listarRanking,
  listarRankingInstituicao,
  listarRankingGrupo,
  buscarRankingId,
  atualizarRanking
}
