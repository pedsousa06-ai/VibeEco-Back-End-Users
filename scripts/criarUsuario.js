
require("dotenv").config()

const knex = require("knex")
const knexConfig = require("../model/database_config_knex/knex_file.js")
const senhaService = require("../service/senha.js")
const { gerarToken } = require("../service/token.js")

const db = knex(knexConfig.development)

const TABELA = "tbl_usuario"

const usuario = {
    nome: "Pedro",
    email: "pedsousa06@gmail.com",
    senha: process.argv[2]
}

async function criarUsuario() {
    try {
        console.log("Verificando usuário de teste...")

        if (!usuario.senha || !usuario.senha.trim()) {
            console.log("Informe a senha: node scripts/criarUsuario.js SUA_SENHA")
            return
        }

        const senhaHash = senhaService.gerarHash(usuario.senha)

        if (!senhaHash || senhaHash.length > 255) {
            throw new Error("Não foi possível gerar o hash da senha.")
        }

        const existente = await db(TABELA)
            .where({ email: usuario.email })
            .first()

        if (existente) {
            await db(TABELA)
                .where({ id: existente.id })
                .update({ senha: senhaHash })

            console.log("O usuário já estava cadastrado. Senha atualizada.")
            console.log("ID:", existente.id)
            console.log("\nAuthorization: Bearer " + gerarToken(existente.id))
            return
        }

        const dados = {
            nome: usuario.nome,
            email: usuario.email,
            senha: senhaHash
        }

        // colunas obrigatórias, sem valor padrão e que não são auto_increment
        const [obrigatorias] = await db.raw(
            `SELECT COLUMN_NAME AS coluna FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
               AND IS_NULLABLE = 'NO' AND COLUMN_DEFAULT IS NULL
               AND EXTRA NOT LIKE '%auto_increment%'`, [TABELA])

        // chaves estrangeiras da tabela
        const [fks] = await db.raw(
            `SELECT COLUMN_NAME AS coluna, REFERENCED_TABLE_NAME AS tabela, REFERENCED_COLUMN_NAME AS chave
             FROM information_schema.KEY_COLUMN_USAGE
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`, [TABELA])

        for (const { coluna } of obrigatorias) {
            if (coluna in dados) continue

            const fk = fks.find(item => item.coluna === coluna)

            if (!fk) {
                console.log(`A coluna obrigatória "${coluna}" não é chave estrangeira.`)
                console.log('Adicione um valor para ela no objeto "dados".')
                return
            }

            const registro = await db(fk.tabela).orderBy(fk.chave).first()

            if (!registro) {
                console.log(`A tabela "${fk.tabela}" (usada por ${coluna}) está vazia.`)
                console.log("Cadastre um registro nela primeiro.")
                return
            }

            dados[coluna] = registro[fk.chave]
            console.log(`${coluna} = ${registro[fk.chave]} (primeiro registro de ${fk.tabela})`)
        }

        const [id] = await db(TABELA).insert(dados)

        console.log("Usuário criado com sucesso!")
        console.log("ID:", id)
        console.log("E-mail:", usuario.email)
        console.log("\nAuthorization: Bearer " + gerarToken(id))

    } catch (error) {
        console.error("Erro ao criar usuário:", error)
    } finally {
        await db.destroy()
    }
}

criarUsuario()