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

//Create
const insertPostCategoria = async function(PostCategoria){
    try {
        let sql = ` insert into tbl_post_categoria (
                        id_post,
                        id_categoria
                        )
                    values (
                            ${PostCategoria.id_post},
                            ${PostCategoria.id_categoria}
                            );`

        //Executar o script no BD
        let result = await knexConex.raw(sql)
        //Validando
        if(result)
            return result[0].insertId
        else
            return false

    } catch (error) {
        //console.log(error)
        return false
    }
}

//Read
const selectByIdPostCategoria = async function(id){
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarPostCategorias(${id});`
        let result = await knexConex.raw(sql)
        if(Array.isArray(result)){
            return result[0]
        }else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados do post filtrando pelo id da categoria)
const selectPostByIdCategoria = async function(idCategoria){
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarPostByIdCategoria(${idCategoria});`
        let result = await knexConex.raw(sql)
        if(Array.isArray(result)){
            return result[0]
        }else
            return false
    } catch (error) {
        return false
    }
}

//Read (Função para retornar os dados da categoria filtrando pelo id do post)
const selectCategoriasByIdPost = async function(idPost){
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarCategoriasByIdPost(${idPost});`
        let result = await knexConex.raw(sql)
        if(Array.isArray(result)){
            return result[0][0]
        }else
            return false
    } catch (error) {
        return false
    }
}

//Read
const selectAllPostCategoria = async function(){
    try {
        let sql = `select * from tbl_post_categoria order by id desc`
        //Aguardando a resposta do banco de dados
        let result = await knexConex.raw(sql)
        //Validando se o knex retornou um array
        if(Array.isArray(result)){
            //Retornar somente os objetos criados através dos atributos referentes a entidade tbl_genero
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Update
const updatePostCategoria = async function(postCategoria){
    try {
        //Script para atualizar os dados no BD
        let sql = ` update tbl_post_categoria set
                        id_post         = ${postCategoria.id_post},
                        id_categoria    = ${postCategoria.id_categoria}
                    where id =  ${postCategoria.id}`
        //Executa o comando no banco de dados
        let result = await knexConex.raw(sql)
        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Delete
const deletePostCategoria = async function(id){
    try {
        let sql     = `delete from tbl_post_categoria where id = ${id};`
        let result  = await knexConex.raw(sql)
        if(result){
            return true
        }else
            return false
    } catch (error) {
        return false
    }
}

//Delete (Função para excluir as categoria filtrando pelo ID do post)
/*
    Essa função será utilizada após o update do post, pois será necessário
    apagar todos as categorias relacionados com o post para inserir as novas
    relações, é uma forma de otimizar o trabalho, pois não precisamos verificar
    o que foi alterado do original.
*/
const deleteCategoriasByIdPost = async function(idPost){
    try {
        let sql     = `delete from tbl_post_categoria where id_post = ${idPost};`
        let result  = await knexConex.raw(sql)
        if(result){
            return true
        }else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertPostCategoria,
    selectByIdPostCategoria,
    selectCategoriasByIdPost,
    selectPostByIdCategoria,
    selectAllPostCategoria,
    updatePostCategoria,
    deletePostCategoria,
    deleteCategoriasByIdPost
}