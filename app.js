/********************************************************************************************************************************************************************************************
 * Objetivo: API centralizada para alimentar o sistema dos usuários do VibeEco, fornecendo endpoints para gerenciamento de usuários, missões, desafios, conteúdos educativos, premiações, conquistas e recompensas.
 * Data: 21/10/2026
 * Autor: Riller Feitosa
 * Versão: 1.0.10.26
 *******************************************************************************************************************************************************************************************/

/* IMPORTAÇÃO DAS DEPENDÊNCIAS */
const express       = require("express")
const cors          = require("cors")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//criando um objeto para manipular o express
const app = express()

//conjunto de permissões a serem aplicados no CORS da API
const corsOption = {
    origin: "*", //A origrm da requisição (definido por meio do IP (192.168...), quando colocado o "*" fica livre para todas as máquinas)
    methods: "GET, POST, PUT, DELETE, OPTIONS", //são os verbos permitidos para serem utilizados na API
    allowedHeaders: ["content-type", "Authorization"] //são permissões do cabeçalho do CORS
}

//configurando as permissões da API atravez do CORS
app.use(cors(corsOption))

// É necessário avisar o Express para ele entender JSON no corpo das requisições (body)
app.use(bodyParserJson)

//importando o arquivo onde estão as rotas da tabela
//Post
const postRouter = require("./routes/post/routes.js")
//definindo a rota para acessar as rotas do postRouter
app.use("/v1/senai/vibeEco", cors(), postRouter) 

//Comentario
const postComentarioRouter = require("./routes/post_comentario/routes.js")
app.use("/v1/senai/vibeEco", cors(), postComentarioRouter)

//Curtidas
const postCurtidaRouter = require("./routes/post_curtida/routes.js")
app.use("/v1/senai/vibeEco", cors(), postCurtidaRouter)

//Ranking
const rankingRouter = require("./routes/ranking/routes.js")
app.use("/v1/senai/vibeEco", cors(), rankingRouter)

//Tela inicio
const telaInicioRouter = require("./routes/tela_inicio/routes.js")
app.use("/v1/senai/vibeEco", cors(), telaInicioRouter)

//Missoes
const missoesRouter = require("./routes/missoes/routes.js")
app.use("/v1/senai/vibeEco", cors(), missoesRouter)

//Usuario_missao
const usuarioMissaoRouter = require("./routes/usuario_missao/routes.js")
app.use("/v1/senai/vibeEco", cors(), usuarioMissaoRouter)

//Usuario_etapa
const usuarioEtapaRouter = require("./routes/usuario_etapa/usuario_etapa.js")
app.use("/v1/senai/vibeEco", cors(), usuarioEtapaRouter)

// Configurações
const rotasConfiguracoes = require('./routes/configuracoes/routes.js')
app.use("/v1/senai/vibeEco", cors(), rotasConfiguracoes) 

// Histórico (ADICIONADO AQUI)
const historicoRouter = require("./routes/historico/routes.js")
app.use("/v1/senai/vibeEco", cors(), historicoRouter)


//iniciando uma API para receber requisições
app.listen(8080, function(){ 
    console.log("API funcionando e aguardando requisições...") 
})