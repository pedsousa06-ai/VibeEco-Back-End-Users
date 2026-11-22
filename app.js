/***************************************************************
 * Objetivo: API centralizada do VibeEco
 * Autor: Riller Feitosa
 * Versão: 1.0.10.26
 ***************************************************************/

// IMPORTAÇÃO DAS DEPENDÊNCIAS
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

// Configuração do Express
const app = express()

// Configuração do JSON
app.use(bodyParser.json())

// Configuração do CORS
const corsOption = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOption))

// ============================================================
// MIDDLEWARE SALVADOR: Converte qualquer ID da URL para Número
// Isso resolve o erro 500 de collation em TODAS as rotas de uma vez
// ============================================================
app.use((req, res, next) => {
    if (req.params) {
        Object.keys(req.params).forEach(key => {
            // Se a chave começar com "id" ou terminar com "Id", converte para número
            if (key.toLowerCase().startsWith("id") || key.toLowerCase().endsWith("id")) {
                if (!isNaN(req.params[key])) {
                    req.params[key] = Number(req.params[key])
                }
            }
        })
    }
    next()
})

// ROTA BASE DA API
const API_BASE = "/v1/senai/vibeEco"

// POST
const postRouter = require("./routes/post/routes.js")
app.use(API_BASE, postRouter)

// COMENTÁRIOS
const postComentarioRouter = require("./routes/post_comentario/routes.js")
app.use(API_BASE, postComentarioRouter)

// CURTIDAS
const postCurtidaRouter = require("./routes/post_curtida/routes.js")
app.use(API_BASE, postCurtidaRouter)

// RANKING
const rankingRouter = require('./routes/ranking/routes.js')
app.use(API_BASE, rankingRouter)

// TELA INICIAL
const telaInicioRouter = require("./routes/tela_inicio/routes.js")
app.use(API_BASE, telaInicioRouter)

// MISSÕES
const missoesRouter = require("./routes/missoes/routes.js")
app.use(API_BASE, missoesRouter)

// USUÁRIO_MISSÃO
const usuarioMissaoRouter = require("./routes/usuario_missao/routes.js")
app.use(API_BASE, usuarioMissaoRouter)

// DESAFIOS (inclui USUÁRIO_DESAFIO: participar, concluir e abandonar)
const desafiosRouter = require("./routes/desafios/routes.js")
app.use(API_BASE, desafiosRouter)

// PERFIL DO USUÁRIO
const perfilRouter = require("./routes/perfil/routes.js")
app.use(API_BASE, perfilRouter)

// USUÁRIO_ETAPA
const usuarioEtapaRouter = require("./routes/usuario_etapa/usuario_etapa.js")
app.use(API_BASE, usuarioEtapaRouter)

// CONFIGURAÇÕES
const rotasConfiguracoes = require("./routes/configuracoes/routes.js")
app.use(API_BASE, rotasConfiguracoes)

// HISTÓRICO
const historicoRouter = require("./routes/historico/routes.js")
app.use(API_BASE, historicoRouter)

// NOTIFICAÇÕES
const notificacaoRouter = require("./routes/notificacao/routes.js")
console.log("Router de notificações:", typeof notificacaoRouter)
app.use(API_BASE, notificacaoRouter)

// CONTEÚDOS EDUCATIVOS
const conteudoEducativoRouter = require("./routes/conteudo_educativo/routes.js")
app.use(API_BASE, conteudoEducativoRouter)

// ============================================================
// TRATAMENTO DE ERRO GLOBAL (Opcional, mas ajuda a ver o erro)
// ============================================================
app.use((err, req, res, next) => {
    console.error("ERRO GLOBAL CAPTURADO:", err)
    res.status(500).json({ error: "Erro interno no servidor", detalhe: err.message })
})

// INICIALIZAÇÃO DA API
app.listen(8080, function() {
    console.log("API funcionando e aguardando requisições...")
    console.log(`Endereço: http://localhost:8080${API_BASE}`)
})