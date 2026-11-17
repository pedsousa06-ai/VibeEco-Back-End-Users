//importando o express
const express = require("express")
const bodyParser    = require("body-parser")

//criando um objeto para manipular dados do body da API em formato Json
const bodyParserJson = bodyParser.json()

//cria um objeto de rota para o arquivo
const router = express.Router()

//importando o arquivo da controller, para pode enviar os dados para serem processados
const controllerPost = require('../../controller/post/controller_post.js')

const multer        = require('multer')
//Configuração para o multer enviar o arquivo de imagem
const storage       = multer.diskStorage({
    destination: function(request, file, cb){
        cb(null, 'uploads/')
    }
})
//Instancia para criar um objeto upload
const upload        = multer()

//EndPoints
router.post('/post', upload.array('anexos',5), async function(request, response){

    let dados = request.body
    let contentType = request.headers['content-type']

    // Recebe os arquivos enviados na requisicao
    let arquivos = request.files

    let result = await controllerPost.inserirNovoPost(
        dados,
        contentType,
        arquivos
    )

    response.status(result.status_code)
    response.json(result)
})

//Seleciona todos os post mais recentes
router.get('/postRecente', async function(request, response){
    let result = await controllerPost.listarPost()
    response.status(result.status_code)
    response.json(result)
})

//Seleciona todos os posts tendo como critério de filtro as curtidas
router.get('/postCurtida', async function(request, response){
    let result = await controllerPost.listarPostRelevantes()
    response.status(result.status_code)
    response.json(result)
})

//Só é utilizado a busca via parâmetro quando o critério de filtro for o id, nas demais ocasiões é via query
router.get('/post/:id', async function(request, response){
    let id = request.params.id
    let result = await controllerPost.buscarPost(id)
    response.status(result.status_code)
    response.json(result)
})

router.put('/post/:id', upload.array('anexos',5), async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']
    let id = request.params.id
    // Recebe os arquivos enviados na requisicao
    let arquivos = request.files
    let result = await controllerPost.atualizarPost(dados, id, contentType, arquivos)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/post/:id', bodyParserJson, async function (request, response) {
    let id      = request.params.id
    let result  = await controllerPost.excluirPost(id)
    response.status(result.status_code)
    response.json(result) 
})

// Exporta as rotas para o app.js
module.exports = router