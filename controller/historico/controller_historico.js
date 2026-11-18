// Deve estar exatamente assim:
const historicoDAO = require('../../model/DAO/historico/historico.js')

const buscarHistorico = async function(req, res) {
    try {
        const idUsuario = req.params.id
        const historicoBruto = await historicoDAO.selectHistoricoByIdUsuario(idUsuario)

        if (!historicoBruto) {
            return res.status(404).json({ mensagem: 'Erro ao buscar histórico ou usuário não encontrado.' })
        }

        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0) 

        const atividades = historicoBruto.map(item => {
            const dataEvento = new Date(item.data_evento)
            const diffTime = Math.abs(hoje - dataEvento)
            const diasAtras = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            const hora = dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

            return {
                id: item.id,
                diasAtras: diasAtras,
                hora: hora,
                tipo: item.tipo,
                rotulo: item.rotulo,
                titulo: item.titulo,
                xp: Number(item.xp),
                mc: Number(item.mc),
                progresso: item.progresso !== undefined ? Number(item.progresso) : undefined,
                descricao: item.descricao,
                detalhes: [
                    { rotulo: 'Tipo', valor: item.tipo.toUpperCase() },
                    { rotulo: 'Status', valor: 'Finalizado' }
                ]
            }
        })

        return res.status(200).json({ atividades })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ mensagem: 'Erro interno ao buscar histórico.' })
    }
}

module.exports = {
    buscarHistorico
}