
const knex = require("knex")
const knexConfig = require("../../database_config_knex/knex_file.js")

const knexConex = knex(knexConfig.development)

// Buscar conteúdo educativo pelo ID e registrar acesso do usuário
const selectConteudoEducativoById = async function (id, idUsuario) {
    try {
        // Registrar acesso do usuário (a tabela não tem chave única: atualiza se já existir, senão insere)
        const atualizados = await knexConex("tbl_usuario_conteudo_educativo")
            .where({ id_usuario: idUsuario, id_conteudo_educativo: id })
            .update({ data_acesso: knexConex.fn.now() })

        if (!atualizados) {
            const existe = await knexConex("tbl_conteudo_educativo").select("id").where("id", id).first()
            if (existe) {
                await knexConex("tbl_usuario_conteudo_educativo")
                    .insert({ id_usuario: idUsuario, id_conteudo_educativo: id })
            }
        }

        const result = await knexConex("tbl_conteudo_educativo as ce")
            .select(
                "ce.id",
                "ce.nome",
                "ce.descricao",
                "ce.img",
                "ce.qtde_xp",
                "ce.duracao_leitura"
            )
            .select(
                knexConex.raw(`
                    COALESCE((
                        SELECT GROUP_CONCAT(c.nome SEPARATOR ', ')
                        FROM tbl_conteudo_educativo_categoria cec
                        INNER JOIN tbl_categoria c
                            ON c.id = cec.id_categoria
                        WHERE cec.id_conteudo_educativo = ce.id
                    ), 'Sem categoria') AS categoria
                `)
            )
            .select(
                knexConex.raw(`
                    COALESCE((
                        SELECT uce.concluido
                        FROM tbl_usuario_conteudo_educativo uce
                        WHERE uce.id_conteudo_educativo = ce.id
                        AND uce.id_usuario = ?
                        LIMIT 1
                    ), 0) AS concluido
                `, [idUsuario])
            )
            .where("ce.id", id)
            .first()

        return result || false

    } catch (error) {
        console.log("Erro ao buscar conteúdo educativo:", error)
        return false
    }
}

// Concluir leitura e entregar XP somente uma vez
const concluirConteudoEducativo = async function (
    idUsuario,
    idConteudo,
    tempoAcesso
) {
    try {
        return await knexConex.transaction(async function (trx) {

            // Verificar se o conteúdo existe
            const conteudo = await trx("tbl_conteudo_educativo")
                .select("id", "qtde_xp")
                .where("id", idConteudo)
                .first()

            if (!conteudo) {
                return false
            }

            // Verificar se o usuário existe
            const usuario = await trx("tbl_usuario")
                .select("id")
                .where("id", idUsuario)
                .first()

            if (!usuario) {
                return false
            }

            // Garantir um único registro de progresso (sem depender de chave única no banco)
            const jaExiste = await trx("tbl_usuario_conteudo_educativo")
                .select("id")
                .where({ id_usuario: idUsuario, id_conteudo_educativo: idConteudo })
                .forUpdate()
                .first()

            if (!jaExiste) {
                await trx("tbl_usuario_conteudo_educativo")
                    .insert({ id_usuario: idUsuario, id_conteudo_educativo: idConteudo })
            }

            // Bloquear registro durante a transação
            const progresso = await trx("tbl_usuario_conteudo_educativo")
                .select("id", "concluido")
                .where({
                    id_usuario: idUsuario,
                    id_conteudo_educativo: idConteudo
                })
                .forUpdate()
                .first()

            if (!progresso) {
                throw new Error(
                    "Não foi possível localizar o progresso do usuário."
                )
            }

            // Se já concluiu, não entregar XP novamente
            if (Boolean(progresso.concluido)) {
                return {
                    jaConcluido: true,
                    xpGanho: 0,
                    concluido: true
                }
            }

            const xp = Number(conteudo.qtde_xp) || 0
            const tempo = Math.max(0, Number(tempoAcesso) || 0)

            // Atualizar progresso
            await trx("tbl_usuario_conteudo_educativo")
                .where("id", progresso.id)
                .update({
                    concluido: true,
                    data_acesso: trx.fn.now(),
                    tempo_acesso: tempo
                })

            // Adicionar XP ao usuário
            await trx("tbl_usuario")
                .where("id", idUsuario)
                .increment("total_xp", xp)

            return {
                jaConcluido: false,
                xpGanho: xp,
                concluido: true
            }
        })

    } catch (error) {
        console.log("Erro ao concluir conteúdo educativo:", error)
        return false
    }
}

// Listar conteúdos educativos com categoria e progresso do usuário
const selectTodosConteudosEducativos = async function (idUsuario) {
    try {
        const result = await knexConex("tbl_conteudo_educativo as ce")
            .select(
                "ce.id",
                "ce.nome",
                "ce.descricao",
                "ce.img",
                "ce.qtde_xp",
                "ce.duracao_leitura"
            )
            .select(
                knexConex.raw(`
                    COALESCE((
                        SELECT GROUP_CONCAT(c.nome SEPARATOR ', ')
                        FROM tbl_conteudo_educativo_categoria cec
                        INNER JOIN tbl_categoria c
                            ON c.id = cec.id_categoria
                        WHERE cec.id_conteudo_educativo = ce.id
                    ), 'Sem categoria') AS categoria
                `)
            )
            .select(
                knexConex.raw(`
                    COALESCE((
                        SELECT uce.concluido
                        FROM tbl_usuario_conteudo_educativo uce
                        WHERE uce.id_conteudo_educativo = ce.id
                        AND uce.id_usuario = ?
                        LIMIT 1
                    ), 0) AS concluido
                `, [idUsuario])
            )
            .orderBy("ce.id", "asc")

        return result

    } catch (error) {
        console.log("Erro ao listar conteúdos educativos:", error)
        return false
    }
}

// Exportar funções utilizadas pelo controller
module.exports = {
    selectConteudoEducativoById,
    concluirConteudoEducativo,
    selectTodosConteudosEducativos
}
