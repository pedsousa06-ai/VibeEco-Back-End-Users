
const notificacaoDAO = require('../../model/DAO/notificacao/notificacao.js')

const listarNotificacoes = async function(req, res) {
    try {
        const idUsuario = req.params.id

        const notificacoes = await notificacaoDAO.selectNotificacoesByIdUsuario(idUsuario)

        if (!notificacoes || notificacoes.length === 0) {
            return res.status(200).json([])
        }

        const formatadas = notificacoes.map(n => {
            const dataCriacao = new Date(n.data_criacao)
            const diffMinutos = Math.floor((new Date() - dataCriacao) / 60000)

            return {
                id: n.id,
                tipo: 'missao',
                titulo: n.titulo,
                texto: n.texto,
                minutosAtras: diffMinutos,
                lida: n.lida === 1 || n.lida === true,
                detalhes: [
                    {
                        rotulo: 'Recebida em',
                        valor: dataCriacao.toLocaleString('pt-BR')
                    }
                ]
            }
        })

        return res.status(200).json(formatadas)

    } catch (error) {
        console.error('Erro ao listar notificações:', error)
        return res.status(500).json({
            mensagem: 'Erro ao buscar notificações.'
        })
    }
}

const marcarComoLida = async function(req, res) {
    try {
        const idNotificacao = req.params.id

        await notificacaoDAO.updateNotificacaoLida(idNotificacao)

        return res.status(200).json({
            mensagem: 'Notificação marcada como lida.'
        })

    } catch (error) {
        console.error('Erro ao marcar notificação:', error)
        return res.status(500).json({
            mensagem: 'Erro ao atualizar notificação.'
        })
    }
}

const marcarTodasComoLidas = async function(req, res) {
    try {
        const idUsuario = req.params.id

        await notificacaoDAO.updateTodasNotificacoesLidas(idUsuario)

        return res.status(200).json({
            mensagem: 'Todas as notificações foram marcadas como lidas.'
        })

    } catch (error) {
        console.error('Erro ao marcar todas como lidas:', error)
        return res.status(500).json({
            mensagem: 'Erro ao atualizar notificações.'
        })
    }
}

module.exports = {
    listarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas
}
