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

//Import das controllers do projeto
const controllerPost = require('./controller/post/controller_post.js')

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//criando um objeto para manipular o express
const app = express()

//conjunto de permissões a serem aplicados no CORS da API
const corsOption = {
    origin: ["*"], //A origrm da requisição (definido por meio do IP (192.168...), quando colocado o "*" fica livre para todas as máquinas)
    methods: "GET, POST, PUT, DELETE, OPTION", //são os verbos permitidos para serem utilizados na API
    allowedHeaders: ["content-type", "Autorizations"] //são permissões do cabeçalho do CORS
}

//configurando as permissões da API atravez do CORS
app.use(cors(corsOption))

//EndPoints
app.post('/v1/senai/vibeEco/post', bodyParserJson, async function(request, response){
    //Recebe o conteúdo dentro do body da requisição (Abrindo o envelope e guardando o conteúdo da requisição)
    let dados = request.body
    let contentType = request.headers['content-type']
    let result = await controllerPost.inserirNovoPost(dados, contentType)
    response.status(result.status_code)
    response.json(result)
})

//Seleciona todos os post mais recentes
app.get('/v1/senai/vibeEco/postRecente', async function(request, response){
    let result = await controllerPost.listarPost()
    response.status(result.status_code)
    response.json(result)
})

//Seleciona todos os posts tendo como critério de filtro as curtidas
app.get('/v1/senai/vibeEco/postCurtida', async function(request, response){
    let result = await controllerPost.listarPostRelevantes()
    response.status(result.status_code)
    response.json(result)
})

//Só é utilizado a busca via parâmetro quando o critério de filtro for o id, nas demais ocasiões é via query
app.get('/v1/senai/vibeEco/post/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerPost.buscarPost(id)
    response.status(result.status_code)
    response.json(result)
})

app.put('/v1/senai/vibeEco/post/:id', bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']
    //Recebe o id a ser atualizado
    let id = request.params.id
    //Recebe os dados enviados no corpo da requisição
    let dados = request.body
    let result = await controllerPost.atualizarPost(dados, id, contentType)
    response.status(result.status_code)
    response.json(result)
})

app.delete('/v1/senai/vibeEco/post/:id', bodyParserJson, async function (request, response) {
    let id      = request.params.id
    let result  = await controllerPost.excluirPost(id)
    response.status(result.status_code)
    response.json(result) 
})


//iniciando uma API para receber requisições
app.listen(8080, function(){ //decidindo a porta para saída do conteúdo
    console.log("API funcionando e aguardando requisições...") //vai mostrar no terminal que a API já está funcionando
})
