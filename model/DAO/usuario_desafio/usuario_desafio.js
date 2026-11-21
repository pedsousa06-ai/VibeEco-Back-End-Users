/********************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela de usuario_desafio
 * Data: 03/11/2026
 * Autor: Lucas Dias Brandão Kolle
 * Versão: 1.0.10.26
 ********************************************************************************************************************************************************************************************/

//importando a biblioteca para gerenciar o banco de dados no node.js
const knex = require("knex")

//importando o arquivo "database_config_knex" para atribuir as configurações do BD
const knexConfig = require("../../database_config_knex/knex_file.js")

//criando a conexão por meio do arquivo que contém os dados necessários para estabelecer o acesso e a conexão
const knexConex = knex(knexConfig.development) //aciona o knex e passa as configurações estabelecidas no arquivo

/*INICIANDO CRUD DA TABELA DE USUARIO_DESAFIO (TABELA INTERMEDIÁRIA)*/

//Status aceitos pela coluna tbl_usuario_desafio.status
const STATUS_VALIDOS = ['EM_ANDAMENTO', 'CONCLUIDO', 'ABANDONADO']

//O usuário entra em um desafio. Tudo roda em uma transação, então ou grava tudo ou nada.
//Regras:
//  - desafio inexistente                  -> { erro: 'DESAFIO_NAO_ENCONTRADO' }
//  - desafio com prazo encerrado          -> { erro: 'DESAFIO_ENCERRADO' } (não vale para quem já participa)
//  - usuário já concluiu                  -> { erro: 'DESAFIO_JA_CONCLUIDO' }
//  - usuário já está participando         -> devolve o vínculo existente, sem erro (clique duplo não quebra)
//  - usuário tinha abandonado             -> reativa o mesmo vínculo (a tabela só aceita um por usuário+desafio)
//  - primeira vez                         -> cria o vínculo
const participarDesafio = async function(id_usuario, id_desafio){

    try {

        return await knexConex.transaction(async (trx) => {

            let [desafios] = await trx.raw(
                `select id, (data_termino is not null and data_termino < curdate()) as encerrado
                   from tbl_desafio
                  where id = ?`,
                [id_desafio]
            )

            if(desafios.length === 0)
                return { erro: 'DESAFIO_NAO_ENCONTRADO' }

            //for update trava a linha até o fim da transação (evita duas requisições ao mesmo tempo)
            let [vinculos] = await trx.raw(
                `select id, status
                   from tbl_usuario_desafio
                  where id_usuario = ? and id_desafio = ?
                    for update`,
                [id_usuario, id_desafio]
            )

            if(vinculos.length === 0){

                if(Number(desafios[0].encerrado))
                    return { erro: 'DESAFIO_ENCERRADO' }

                let [inserido] = await trx.raw(
                    `insert into tbl_usuario_desafio (id_usuario, id_desafio, status, progresso, data_conclusao)
                     values (?, ?, 'EM_ANDAMENTO', 0, null)`,
                    [id_usuario, id_desafio]
                )

                return { id: inserido.insertId, status: 'EM_ANDAMENTO', progresso: 0, criado: true }
            }

            let vinculo = vinculos[0]

            if(vinculo.status === 'EM_ANDAMENTO')
                return { id: vinculo.id, status: 'EM_ANDAMENTO', progresso: 0, criado: false }

            if(vinculo.status === 'CONCLUIDO')
                return { erro: 'DESAFIO_JA_CONCLUIDO' }

            //ABANDONADO: volta a participar do zero
            if(Number(desafios[0].encerrado))
                return { erro: 'DESAFIO_ENCERRADO' }

            await trx.raw(
                `update tbl_usuario_desafio
                    set status = 'EM_ANDAMENTO', progresso = 0, data_conclusao = null
                  where id = ?`,
                [vinculo.id]
            )

            return { id: vinculo.id, status: 'EM_ANDAMENTO', progresso: 0, criado: false }
        })

    } catch (error) {

        //Duas requisições simultâneas tentaram criar o mesmo vínculo (constraint uq_usuario_desafio).
        //A outra venceu: devolvemos o vínculo que ela criou em vez de acusar erro.
        if(error && error.code === 'ER_DUP_ENTRY'){
            try {
                let [existentes] = await knexConex.raw(
                    `select id, status from tbl_usuario_desafio where id_usuario = ? and id_desafio = ?`,
                    [id_usuario, id_desafio]
                )
                if(existentes.length > 0){
                    if(existentes[0].status === 'CONCLUIDO')
                        return { erro: 'DESAFIO_JA_CONCLUIDO' }
                    return { id: existentes[0].id, status: existentes[0].status, progresso: 0, criado: false }
                }
            } catch (erroConsulta) {
                console.log(erroConsulta)
            }
        }

        console.log(error)
        return false
    }
}

//Muda o status de um vínculo usuário-desafio (concluir, abandonar ou voltar a participar).
//Também roda em transação: ao concluir, grava o status e paga as super_coins do desafio juntos,
//e só paga uma vez (um desafio concluído não muda mais de status).
//Regras:
//  - vínculo inexistente                  -> { erro: 'USUARIO_DESAFIO_NAO_ENCONTRADO' }
//  - mesmo status que já tinha            -> não faz nada e não paga nada (coins_ganhos: 0)
//  - já estava concluído                  -> { erro: 'DESAFIO_JA_CONCLUIDO' }
//  - concluir sem estar em andamento      -> { erro: 'DESAFIO_NAO_ESTA_EM_ANDAMENTO' }
//  - concluir ou reativar após o prazo    -> { erro: 'DESAFIO_ENCERRADO' }
const alterarStatusUsuarioDesafio = async function(id, novoStatus){

    try {

        if(!STATUS_VALIDOS.includes(novoStatus))
            return { erro: 'STATUS_INVALIDO' }

        return await knexConex.transaction(async (trx) => {

            let [vinculos] = await trx.raw(
                `select id, id_usuario, id_desafio, status, progresso
                   from tbl_usuario_desafio
                  where id = ?
                    for update`,
                [id]
            )

            if(vinculos.length === 0)
                return { erro: 'USUARIO_DESAFIO_NAO_ENCONTRADO' }

            let vinculo = vinculos[0]

            //Nada a fazer: devolve o estado atual
            if(vinculo.status === novoStatus){
                return {
                    id:             vinculo.id,
                    id_usuario:     vinculo.id_usuario,
                    id_desafio:     vinculo.id_desafio,
                    status:         vinculo.status,
                    progresso:      vinculo.progresso,
                    coins_ganhos:   0
                }
            }

            if(vinculo.status === 'CONCLUIDO')
                return { erro: 'DESAFIO_JA_CONCLUIDO' }

            if(novoStatus === 'CONCLUIDO' && vinculo.status !== 'EM_ANDAMENTO')
                return { erro: 'DESAFIO_NAO_ESTA_EM_ANDAMENTO' }

            let [desafios] = await trx.raw(
                `select super_coins, (data_termino is not null and data_termino < curdate()) as encerrado
                   from tbl_desafio
                  where id = ?`,
                [vinculo.id_desafio]
            )

            let desafio = desafios[0]

            if(novoStatus !== 'ABANDONADO' && Number(desafio.encerrado))
                return { erro: 'DESAFIO_ENCERRADO' }

            let concluindo  = novoStatus === 'CONCLUIDO'
            let progresso   = concluindo ? 100 : 0

            //O trecho do SQL abaixo vem de uma constante deste arquivo (nunca do usuário)
            let dataConclusao = concluindo ? 'now()' : 'null'

            await trx.raw(
                `update tbl_usuario_desafio
                    set status = ?, progresso = ?, data_conclusao = ${dataConclusao}
                  where id = ?`,
                [novoStatus, progresso, vinculo.id]
            )

            let coinsGanhos = 0

            if(concluindo){
                coinsGanhos = Number(desafio.super_coins) || 0

                //coalesce troca NULL por 0, porque NULL + número = NULL
                await trx.raw(
                    `update tbl_usuario
                        set coins = coalesce(coins, 0) + ?
                      where id = ?`,
                    [coinsGanhos, vinculo.id_usuario]
                )
            }

            return {
                id:             vinculo.id,
                id_usuario:     vinculo.id_usuario,
                id_desafio:     vinculo.id_desafio,
                status:         novoStatus,
                progresso:      progresso,
                coins_ganhos:   coinsGanhos
            }
        })

    } catch (error) {
        console.log(error)
        return false
    }
}

//função para retornar um dado pelo id
const selectUsuarioDesafioByIdDesafioByIdUsuario = async function(id_usuario, id_desafio){

    try {
        
        let sql = `call procListarDesafioIdDesafioIdUsuario(${id_desafio},${id_usuario});`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){ 

            return result[0][0]

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//função para retornar um dado pelo id
const selectUsuarioDesafioByIdDesafio = async function(id_desafio){

    try {
        
        let sql = `call procListarDesafioIdDesafio(${id_desafio});`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){ 

            return result[0][0]

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//função para retornar um dado pelo id
const selectAllUsuarioDesafioByIdUsuario = async function(id_usuario){

    try {
        
        let sql = `call procListarDesafioIdUsuarioTodos(${id_usuario});`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){ 

            return result[0][0]

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Read
const selectByIdUsuarioDesafio = async function (id) {
    try {
        //Comando para buscar o id (int) tendo como parâmetro o id solicitado na função
        let sql = `call procListarDesafioIdUsuarioDesafio(${id});`
        let result = await knexConex.raw(sql)
        if (Array.isArray(result)) {
            return result[0][0]
        } else
            return false
    } catch (error) {
        return false
    }
}

//função para retornar um dado pelo id
const selectIndiviudalColetivoUsuarioDesafioByIdUsuario = async function(id_usuario, id_tipo_desafio){

    try {
        
        let sql = `call procListarDesafioIdUsuarioIndividuaisColetivos(${id_usuario}, ${id_tipo_desafio});`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){ 

            return result[0][0]

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//função para deletar um dado pelo id
const deleteUsuarioDesafio = async function(id){

    try {

        //criando variável sql
        let sql = `delete from tbl_usuario_desafio where id = ${id};`

        //enviando para o banco
        let result = await knexConex.raw(sql)

        //tratando retorno
        if(result){
            return true
        }else{
            return false
        }
        
    } catch (error) {
        return false
    }
}


//função para retornar um desafio com a situação do usuário nele.
//Diferente de selectUsuarioDesafioByIdDesafioByIdUsuario (que só acha quem já participa),
//esta devolve o desafio mesmo que o usuário ainda não tenha entrado
//(id_usuario_desafio e status_desafio vêm como null nesse caso)
const selectDesafioDoUsuarioByIdUsuarioByIdDesafio = async function(id_usuario, id_desafio){

    try {

        let todos = await selectAllUsuarioDesafioByIdUsuario(id_usuario)

        if(Array.isArray(todos))
            return todos.filter((desafio) => Number(desafio.id_desafio) === Number(id_desafio))
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    participarDesafio,
    alterarStatusUsuarioDesafio,
    selectDesafioDoUsuarioByIdUsuarioByIdDesafio,
    selectByIdUsuarioDesafio,
    selectUsuarioDesafioByIdDesafioByIdUsuario,
    selectUsuarioDesafioByIdDesafio,
    selectAllUsuarioDesafioByIdUsuario,
    selectIndiviudalColetivoUsuarioDesafioByIdUsuario,
    deleteUsuarioDesafio,
}