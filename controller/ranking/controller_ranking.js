// controller/ranking/controller_ranking.js
const rankingDAO = require('../../model/DAO/ranking/ranking.js')

function resposta(statusCode, status, message, response = {}) {
  return { status_code: statusCode, status, message, response }
}

async function listarRanking() {
  const ranking = await rankingDAO.selectAllRanking()
  if (ranking === false) {
    return resposta(500, false, 'Não foi possível consultar o ranking.')
  }
  // Lista vazia é uma resposta válida para GET; o front exibe o estado vazio.
  return resposta(200, true, 'Ranking consultado com sucesso.', { ranking })
}

async function buscarRankingId(id) {
  if (!/^\d+$/.test(String(id))) {
    return resposta(400, false, 'ID de usuário inválido.')
  }
  const usuario = await rankingDAO.selectByIdUsuario(Number(id))
  if (usuario === false) return resposta(500, false, 'Erro ao consultar usuário.')
  if (!Array.isArray(usuario) || usuario.length === 0) {
    return resposta(404, false, 'Usuário não encontrado.')
  }
  return resposta(200, true, 'Usuário encontrado.', { usuario: usuario[0] })
}

async function atualizarRanking(dados, id, contentType) {
  if (!String(contentType || '').toLowerCase().includes('application/json')) {
    return resposta(415, false, 'Envie o conteúdo como application/json.')
  }

  if (!/^\d+$/.test(String(id))) {
    return resposta(400, false, 'ID de usuário inválido.')
  }

  if (!dados || typeof dados.exibir_ranking !== 'boolean') {
    return resposta(400, false, 'O campo exibir_ranking deve ser true ou false.')
  }

  const usuario = await buscarRankingId(id)
  if (usuario.status_code !== 200) return usuario

  const resultado = await rankingDAO.updateVisibilidadeRanking({
    id: Number(id),
    exibir_ranking: dados.exibir_ranking
  })

  if (resultado === false) {
    return resposta(500, false, 'Não foi possível atualizar a visibilidade do ranking.')
  }

  return resposta(200, true, 'Visibilidade do ranking atualizada.', {
    id: Number(id),
    exibir_ranking: dados.exibir_ranking
  })
}

async function selectRankingPorInstituicao(req, res) {
    try {
        const idUsuario = req.params.id;

        const resultado = await rankingDAO.selectRankingPorInstituicao(idUsuario);

        if (resultado === false) {
            return res.status(500).json({
                mensagem: 'Erro ao buscar ranking da instituição'
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error('Erro no ranking por instituição:', error);

        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
}

module.exports = { listarRanking, atualizarRanking, selectRankingPorInstituicao, buscarRankingId }
