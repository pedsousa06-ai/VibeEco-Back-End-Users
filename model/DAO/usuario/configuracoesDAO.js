/*******************************************************************************************************
 * 
 * Objetivo: Arquivo responsável pelo CRUD das preferências do usuário (Tela de Configurações)
 * Data: 16/11/2026
 * Autor: Riller
 * Versão: 1.0
 * 
 *******************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')
const knexConex = knex(knexConfig.development)

// Função para buscar as configurações (preferências) do usuário
const selectConfiguracoesById = async function(id) {
    try {
        let sql = `select idioma, tema, alto_contraste, tamanho_fonte, animacoes, 
                          exibir_ranking, atividades_visiveis, perfil_publico 
                   from tbl_usuario where id = ${id};`
        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0][0] // Retorna o primeiro objeto encontrado
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

// Função para atualizar as configurações (preferências) do usuário
const updateConfiguracoesUsuario = async function(id, dados) {
    try {
        // Monta a string do UPDATE dinamicamente apenas com os campos enviados
        let campos = []
        
        if (dados.idioma !== undefined) campos.push(`idioma = '${dados.idioma}'`)
        if (dados.tema !== undefined) campos.push(`tema = '${dados.tema}'`)
        if (dados.altoContraste !== undefined) campos.push(`alto_contraste = ${dados.altoContraste ? 1 : 0}`)
        if (dados.tamanhoFonte !== undefined) campos.push(`tamanho_fonte = '${dados.tamanhoFonte}'`)
        if (dados.animacoes !== undefined) campos.push(`animacoes = ${dados.animacoes ? 1 : 0}`)
        if (dados.aparecerNoRanking !== undefined) campos.push(`exibir_ranking = ${dados.aparecerNoRanking ? 1 : 0}`)
        if (dados.atividadesVisiveis !== undefined) campos.push(`atividades_visiveis = ${dados.atividadesVisiveis ? 1 : 0}`)
        if (dados.perfilPublico !== undefined) campos.push(`perfil_publico = ${dados.perfilPublico ? 1 : 0}`)

        if (campos.length === 0) return false

        let sql = `update tbl_usuario set ${campos.join(', ')} where id = ${id};`
        let result = await knexConex.raw(sql)

        if (result){
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    selectConfiguracoesById,
    updateConfiguracoesUsuario
}