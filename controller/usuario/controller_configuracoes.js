/*******************************************************************************************************
 * 
 * Objetivo: Controller das preferências do usuário (Tela de Configurações)
 * Data: 16/11/2026
 * Autor: Riller
 * Versão: 1.0
 * 
 *******************************************************************************************************/

// Importa o DAO de configurações (que criamos separado)
const configuracoesDAO = require('../../model/DAO/usuario/configuracoesDAO.js')

// GET - Buscar configurações
const buscarConfiguracoes = async function(req, res) {
    try {
        const idUsuario = req.params.id
        const configuracoes = await configuracoesDAO.selectConfiguracoesById(idUsuario)

        if (!configuracoes) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
        }

        return res.status(200).json({
            idioma: configuracoes.idioma,
            tema: configuracoes.tema,
            altoContraste: !!configuracoes.alto_contraste,
            tamanhoFonte: configuracoes.tamanho_fonte,
            animacoes: !!configuracoes.animacoes,
            aparecerNoRanking: !!configuracoes.exibir_ranking,
            atividadesVisiveis: !!configuracoes.atividades_visiveis,
            perfilPublico: !!configuracoes.perfil_publico
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ mensagem: 'Erro ao buscar configurações.' })
    }
}

// PUT - Atualizar configurações
const atualizarConfiguracoes = async function(req, res) {
    try {
        const idUsuario = req.params.id
        const dados = req.body

        const atualizou = await configuracoesDAO.updateConfiguracoesUsuario(idUsuario, dados)

        if (!atualizou) {
            return res.status(400).json({ mensagem: 'Nenhum dado válido enviado ou erro ao atualizar.' })
        }

        // Busca novamente para devolver o estado atualizado
        const configuracoes = await configuracoesDAO.selectConfiguracoesById(idUsuario)

        return res.status(200).json({
            idioma: configuracoes.idioma,
            tema: configuracoes.tema,
            altoContraste: !!configuracoes.alto_contraste,
            tamanhoFonte: configuracoes.tamanho_fonte,
            animacoes: !!configuracoes.animacoes,
            aparecerNoRanking: !!configuracoes.exibir_ranking,
            atividadesVisiveis: !!configuracoes.atividades_visiveis,
            perfilPublico: !!configuracoes.perfil_publico
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ mensagem: 'Erro ao salvar configurações.' })
    }
}

module.exports = {
    buscarConfiguracoes,
    atualizarConfiguracoes
}