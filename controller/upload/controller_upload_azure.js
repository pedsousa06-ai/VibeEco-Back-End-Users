//Import do arquivo de configuração da azure
const AZURE = require("../modulo/config_upload_azure")
//Import da dependencia para realizar uma requisição HTTP pelo node
//const fetch = require('node-fetch').default
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const uploadFiles = async function (file) {
    //Concatena no nome do arquivo a data e a hora
    let fileName = Date.now() + file.originalname
    //URL para enviar para o banco de dados
    let urlFile = `https://${AZURE.ACCOUNT}.blob.core.windows.net/${AZURE.CONTAINER}/${fileName}`
    //URL para enviar o arquivo para o container da azure
    let urlFileToken = `${urlFile}?${AZURE.TOKEN}`

    let response = await fetch(urlFileToken,{
        method: 'PUT',
        headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-type': 'application/octet-stream'
        },
        //argumento.buffer -> argumento + o conteudo dentro dele
        body: file.buffer
    })

    if(response.status == 201)
        return urlFile
    else
        return false
}

module.exports = {uploadFiles}