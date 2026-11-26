/********************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo SELECT no Banco de dados MySQL na tabela de user
 * Data: 10/11/2026
 * Autor: Riller
 * Versão: 1.0.10.26
 ********************************************************************************************************************************************************************************************/

//importando a biblioteca para gerenciar o banco de dados no node.js
const knex = require("knex")

//importando o arquivo "database_config_knex" para atribuir as configurações do BD
const knexConfig = require("../../database_config_knex/knex_file.js")

//criando a conexão por meio do arquivo que contém os dados necessários para estabelecer o acesso e a conexão
const knexConex = knex(knexConfig.development) //aciona o knex e passa as configurações estabelecidas no arquivo

//retorna todos os dados do usuario
const selectDadosInicioByIdUsuario = async function(id){

    try {

        //enviando para o banco de dados
        let result = await knexConex.raw('call procListarDadosInicio(?)', [id])
        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0][0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retorna todas as missoes em andamento
const selectMissoesAndamentoByIdUsuario = async function(id){
    try {
        // SELECT direto, sem procedure
        let sql = `
            SELECT 
                um.id_usuario,
                um.id_missao,
                m.nome AS nome_missao,
                m.descricao AS descricao_missao,
                m.total_xp_missao AS xp_missao,
                m.total_xp_missao AS qtde_xp,
                um.status AS status_missao,
                um.progresso AS progresso_missao,
                um.progresso AS progresso,
                DATEDIFF(m.data_termino, CURDATE()) AS prazo_dias,
                d.nome AS nome_dificuldade
            FROM tbl_usuario_missao um
            INNER JOIN tbl_missao m ON m.id = um.id_missao
            LEFT JOIN tbl_dificuldade d ON d.id = m.id_dificuldade
            WHERE um.id_usuario = ? AND um.status = 'EM_ANDAMENTO'
        `;
        
        let result = await knexConex.raw(sql, [id]);

        if(Array.isArray(result)){
            return result[0]; // O knex retorna os dados na posição 0
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

//retorna os conteudos recomendados: os que o usuario ainda nao concluiu (inclui os que ele nunca abriu)
const selectConteudosRecomendadosByIdUsuario = async function(id){

    try {
        let sql = `
            SELECT
                c.id AS id,
                ? AS id_usuario,
                c.id AS id_conteudo_educativo,
                c.nome AS nome_conteudo_educativo,
                c.nome AS nome_conteudo,
                c.qtde_xp AS xp_conteudo_educativo,
                c.qtde_xp AS qtde_xp,
                c.duracao_leitura AS duracao_leitura,
                c.img AS img,
                COALESCE((
                    SELECT cat.nome
                    FROM tbl_conteudo_educativo_categoria cc
                    INNER JOIN tbl_categoria cat ON cat.id = cc.id_categoria
                    WHERE cc.id_conteudo_educativo = c.id
                    ORDER BY cat.id
                    LIMIT 1
                ), 'Geral') AS categoria,
                0 AS status,
                0 AS concluido
            FROM tbl_conteudo_educativo c
            WHERE NOT EXISTS (
                SELECT 1 FROM tbl_usuario_conteudo_educativo uc
                WHERE uc.id_conteudo_educativo = c.id
                  AND uc.id_usuario = ?
                  AND uc.concluido = 1
            )
            ORDER BY c.id DESC
            LIMIT 10
        `
        let result = await knexConex.raw(sql, [id, id])
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

//retorna a ofensiva do usuario
const selectOfensivaByIdUsuario = async function(id){

    try {

        //enviando para o banco de dados
        let result = await knexConex.raw('call procListarOfensivaUsuario(?)', [id])
        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0][0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retorna todos os desafios em destaque
const selectDesafiosDestaque = async function(){

    try {
        
        //criando variável sql
        let sql = `select * from vwDesafios;`

        //enviando para o banco de dados
        let result = await knexConex.raw(sql)

        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

//retorna todas as conquistas do usuario
const selectConquistasByIdUsuario = async function(id){

    try {

        //enviando para o banco de dados
        let result = await knexConex.raw('call procListarConquistasUsuario(?)', [id])
        //Verificando se é um array
        if(Array.isArray(result)){

            return result[0][0]
        }else{
            return false
        }
    } catch (error) {
        //console.log(error)
        return false
    }
}

module.exports = {
    selectDadosInicioByIdUsuario,
    selectMissoesAndamentoByIdUsuario,
    selectConteudosRecomendadosByIdUsuario,
    selectOfensivaByIdUsuario,
    selectDesafiosDestaque,
    selectConquistasByIdUsuario
}