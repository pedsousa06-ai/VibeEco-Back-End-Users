
const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')

const knexConex = knex(knexConfig.development)

// SUBCONSULTA: QUANTIDADE DE CONQUISTAS POR USUÁRIO
function conquistasPorUsuario() {
  return knexConex('tbl_usuario_conquista as uc')
    .select('uc.id_usuario')
    .countDistinct({ conquistas: 'uc.id_conquista' })
    .groupBy('uc.id_usuario')
    .as('c')
}

// CAMPOS PADRÃO DO RANKING
function selecionarDadosUsuario(query, alias = 'u') {
  return query.select(
    `${alias}.id`,
    `${alias}.nome as nome_usuario`,
    `${alias}.foto as foto_usuario`,
    `${alias}.total_xp as xp_usuario`,
    'e.nome as escolaridade',
    'i.nome as instituicao',
    'l.nome as nome_level',
    'l.numero_level as nivel',
    knexConex.raw(
      'COALESCE(??, 0) AS ??',
      ['c.conquistas', 'conquistas']
    )
  )
}

// RANKING GERAL
async function selectAllRanking() {
  try {
    return await knexConex('vwRanking as r')
      .leftJoin(conquistasPorUsuario(), 'c.id_usuario', 'r.id')
      .select(
        'r.id',
        'r.nome_usuario',
        'r.foto_usuario',
        'r.xp_usuario',
        'r.escolaridade',
        'r.instituicao',
        'r.nome_level',
        'r.nivel',
        knexConex.raw(
          'COALESCE(??, 0) AS ??',
          ['c.conquistas', 'conquistas']
        )
      )
      .orderBy('r.xp_usuario', 'desc')
      .orderBy('r.id', 'asc')
  } catch (error) {
    console.error('Erro ao consultar ranking geral:', error)
    return false
  }
}

// RANKING DA INSTITUIÇÃO DO USUÁRIO
async function selectRankingPorInstituicao(idUsuario) {
  try {
    return await selecionarDadosUsuario(
      knexConex('tbl_usuario as u')
        .join(
          'tbl_usuario as solicitante',
          'solicitante.id_instituicao',
          'u.id_instituicao'
        )
        .join('tbl_instituicao as i', 'u.id_instituicao', 'i.id')
        .join('tbl_escolaridade as e', 'u.id_escolaridade', 'e.id')
        .join('tbl_level_user as l', 'u.id_level', 'l.id')
        .leftJoin(conquistasPorUsuario(), 'c.id_usuario', 'u.id')
        .where('solicitante.id', idUsuario)
        .where('u.exibir_ranking', 1)
    )
      .orderBy('u.total_xp', 'desc')
      .orderBy('u.id', 'asc')
  } catch (error) {
    console.error('Erro ao consultar ranking da instituição:', error)
    return false
  }
}

// RANKING DO GRUPO DO USUÁRIO
async function selectRankingPorGrupo(idUsuario) {
  try {
    return await knexConex('tbl_usuario_grupo as ugSolicitante')
      .join(
        'tbl_usuario_grupo as ug',
        'ug.id_grupo',
        'ugSolicitante.id_grupo'
      )
      .join('tbl_grupo as g', 'ug.id_grupo', 'g.id')
      .join('tbl_usuario as u', 'ug.id_usuario', 'u.id')
      .join('tbl_instituicao as i', 'u.id_instituicao', 'i.id')
      .join('tbl_escolaridade as e', 'u.id_escolaridade', 'e.id')
      .join('tbl_level_user as l', 'u.id_level', 'l.id')
      .leftJoin(conquistasPorUsuario(), 'c.id_usuario', 'u.id')
      .where('ugSolicitante.id_usuario', idUsuario)
      .where('g.ativo', 1)
      .where('u.exibir_ranking', 1)
      .select(
        'u.id',
        'u.nome as nome_usuario',
        'u.foto as foto_usuario',
        'u.total_xp as xp_usuario',
        'e.nome as escolaridade',
        'i.nome as instituicao',
        'l.nome as nome_level',
        'l.numero_level as nivel',
        'g.nome as grupo',
        knexConex.raw(
          'COALESCE(??, 0) AS ??',
          ['c.conquistas', 'conquistas']
        )
      )
      .orderBy('u.total_xp', 'desc')
      .orderBy('u.id', 'asc')
  } catch (error) {
    console.error('Erro ao consultar ranking do grupo:', error)
    return false
  }
}

// BUSCAR USUÁRIO SEM EXPOR DADOS PRIVADOS
async function selectByIdUsuario(id) {
  try {
    return await knexConex('tbl_usuario')
      .where({ id })
      .select(
        'id',
        'nome',
        'foto',
        'total_xp',
        'id_instituicao',
        'id_level',
        'exibir_ranking'
      )
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return false
  }
}

// ALTERAR VISIBILIDADE NO RANKING
async function updateVisibilidadeRanking(dados) {
  try {
    return await knexConex('tbl_usuario')
      .where({ id: dados.id })
      .update({
        exibir_ranking: dados.exibir_ranking
      })
  } catch (error) {
    console.error('Erro ao atualizar visibilidade:', error)
    return false
  }
}

module.exports = {
  selectAllRanking,
  selectRankingPorInstituicao,
  selectRankingPorGrupo,
  selectByIdUsuario,
  updateVisibilidadeRanking
}
