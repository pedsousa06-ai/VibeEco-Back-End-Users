/*******************************************************************************************
 * Objetivo: envio do código de recuperação de senha por e-mail (Gmail via nodemailer).
 * Sem EMAIL_USER/EMAIL_PASSWORD no .env, ou sem o pacote nodemailer instalado, o código
 * é impresso no console da API (modo desenvolvimento) e a recuperação continua funcionando.
 *******************************************************************************************/
const escaparHTML = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')

let transporter = null
const obterTransporter = function () {
    if (transporter) return transporter
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return null
    try {
        const nodemailer = require('nodemailer')
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', port: 587, secure: false,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
        })
        return transporter
    } catch {
        return null
    }
}

// devolve true se o e-mail foi mesmo enviado, false se caiu no modo console/erro
const enviarCodigoRecuperacao = async function (destinatario, codigo) {
    const t = obterTransporter()
    if (!t) {
        console.log(`[VIBEECO] (sem e-mail configurado) código de recuperação de ${destinatario}: ${codigo}`)
        return false
    }
    try {
        await t.sendMail({
            from: `"VibeEco" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: 'VibeEco - código de recuperação de senha',
            text: `Seu código de recuperação é ${codigo}. Ele vale por 15 minutos. Se você não pediu, ignore este e-mail.`,
            html: `<p>Seu código de recuperação de senha do VibeEco é:</p><h2 style="letter-spacing:6px">${escaparHTML(codigo)}</h2><p>Ele vale por 15 minutos. Se você não pediu, ignore este e-mail.</p>`
        })
        return true
    } catch (erro) {
        console.error('[VIBEECO] Falha ao enviar e-mail:', erro.message)
        console.log(`[VIBEECO] código de recuperação de ${destinatario}: ${codigo}`)
        return false
    }
}

module.exports = { enviarCodigoRecuperacao }
