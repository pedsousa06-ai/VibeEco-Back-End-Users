//Import do arquivo de configuração da azure
const AZURE = require("../modulo/config_upload_azure")
//Import da dependencia para realizar uma requisição HTTP pelo node
//const fetch = require('node-fetch').default
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

// Excluir arquivo do Azure
const deleteFile = async function (urlFile) {

    try {
        //Validacao para averiguar se a URL existe no servidor de arquivos
        if (!urlFile)
            return false

        // Recuperar o nome do arquivo a partir da URL armazenada
        // decodeURIComponent() -> decodeURIComponent() 
        let nomeArquivo = decodeURIComponent(
            /*
             * new URL(urlFile) -> Transforma a URL recebida em um objeto URL, permitindo acessar suas partes individualmente.
             * .pathname        -> Recupera o caminho do arquivo dentro do endereço.
             * .split('/')      -> Divide o caminho sempre que encontra uma barra /.
             * .pop()           -> Recupera o último elemento do array, ou seja, o nome do arquivo.
             * Result: [
                            "anexos",
                            "1730567890imagem%20teste.png"
                ]
             */
            new URL(urlFile).pathname.split('/').pop()
        )

        // Montar a URL do Blob
        let urlBlob = `https://${AZURE.ACCOUNT}.blob.core.windows.net/${AZURE.CONTAINER}/${encodeURIComponent(nomeArquivo)}`

        // Adicionar o SAS Token
        /*
            O SAS Token é uma autorização que permite executar operações específicas no Azure Blob Storage.
            Nesse caso, precisamos de autorização para excluir arquivos.

            O código verifica se o token começa com ?.

            Se começar, remove esse primeiro caractere utilizando: AZURE.TOKEN.substring(1)
            Isso é necessário porque o token será adicionado à URL posteriormente, e não queremos colocar dois pontos de interrogação.    
        */
        let token = AZURE.TOKEN.startsWith('?')
            ? AZURE.TOKEN.substring(1)
            : AZURE.TOKEN

        let response = await fetch(`${urlBlob}?${token}`, {
            method: 'DELETE',
            headers: {
                'x-ms-version': '2021-12-02'
            }
        })
        // 202 = arquivo excluído com sucesso
        // 404 = arquivo não encontrado
        if (response.status === 202)
            return true

        console.log('Erro ao excluir arquivo Azure:', response.status)

        return false

    } catch (error) {

        console.log('Erro na exclusão do Azure:', error)

        return false
    }
}

module.exports = {uploadFiles, deleteFile}