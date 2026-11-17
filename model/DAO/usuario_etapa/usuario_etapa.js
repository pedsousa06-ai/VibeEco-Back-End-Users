/********************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela
 * de relação entre filme e gênero
 * Data: 22.05.26
 * Nome: Riller
 * Versão: 1.0
 ********************************************************************************************/

//Import da biblioteca para gerenciar o banco de dados Mysql no node.js
const knex = require('knex')

//Import da biblioteca de configuração para conexão com o BD Mysql
const knexConfig = require('../../database_config_knex/knex_file.js')

//Criar a conexão com o BD Mysql
const knexConex = knex(knexConfig.development)

//Conclui a etapa chamando a procedure (insere, atualiza progresso, XP e coins)
const concluirEtapa = async function(idUsuario, idEtapa){
    try {
        let sql = `CALL procConcluirEtapa(${Number(idUsuario)}, ${Number(idEtapa)})`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result) && Array.isArray(result[0])){
            return result[0][0]
        }else{
            return false
        }

    } catch (error) {
        return {erro: String(error.message) + ' ' + JSON.stringify(error.meta || {})}
    }
}

//Read
const selectByIdUsuarioEtapa = async function(id){
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarUsuarioEtapaByIdUsuarioEtapa(${id});`
        let result = await knexConex.raw(sql)
        if(Array.isArray(result)){
            return result[0][0]
        }else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados do post filtrando pelo id da categoria)
const selectEtapaByIdUsuario = async function(idUsuario){
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarUsuarioEtapaByIdUsuario(${idUsuario});`
        let result = await knexConex.raw(sql)
        if(Array.isArray(result)){
            return result[0][0]
        }else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados da categoria filtrando pelo id do post)
const selectUsuarioByIdEtapa = async function(idEtapa){
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarUsuarioEtapaByIdEtapa(${idEtapa});`
        let result = await knexConex.raw(sql)
        if(Array.isArray(result)){
            return result[0][0]
        }else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    concluirEtapa,
    selectByIdUsuarioEtapa,
    selectEtapaByIdUsuario,
    selectUsuarioByIdEtapa,
    deleteUsuarioEtapa
}