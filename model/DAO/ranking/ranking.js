// dao/ranking/dao_ranking.js
const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')

const knexConex = knex(knexConfig.development)

async function selectAllRanking() {
  try {
    return await knexConex('vwRanking').select('*')
  } catch (error) {
    console.error('Erro ao consultar vwRanking:', error)
    return false
  }
}

async function updateVisibilidadeRanking(dados) {
  try {
    const resultado = await knexConex('tbl_usuario')
      .where({ id: dados.id })
      .update({ exibir_ranking: dados.exibir_ranking })
    return resultado
  } catch (error) {
    console.error('Erro ao atualizar visibilidade do ranking:', error)
    return false
  }
}

async function selectByIdUsuario(id) {
  try {
    return await knexConex('tbl_usuario').where({ id }).select('*')
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return false
  }
}


async function selectRankingPorInstituicao(idInstituicao) {
  try {
    return await knexConex('tbl_usuario as u')
      .join('tbl_instituicao as i', 'u.id_instituicao', 'i.id')
      .select(
        'u.id',
        'u.nome',
        'u.foto',
        'u.total_xp',
        'u.id_instituicao',
        'i.nome as instituicao'
      )
      .where('u.id_instituicao', idInstituicao)
      .where('u.exibir_ranking', true)
      .orderBy('u.total_xp', 'desc')
  } catch (error) {
    console.error('Erro ao consultar ranking por instituição:', error)
    return false
  }
}


module.exports = {
  selectAllRanking,
  updateVisibilidadeRanking,
  selectByIdUsuario,
  selectRankingPorInstituicao
}
