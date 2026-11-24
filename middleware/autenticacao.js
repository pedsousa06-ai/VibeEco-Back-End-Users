/*******************************************************************************************
 * Objetivo: protege a API com o token JWT do usuário.
 *  - /auth/* é público (login, recuperação de senha, primeiro acesso).
 *  - Token enviado e inválido/expirado -> 401.
 *  - Sem token: segue normalmente, a não ser que AUTH_OBRIGATORIA=true no .env (aí responde 401).
 *    (Padrão "false" para o app Android continuar funcionando até a tela de login dele ficar pronta.)
 *  - Com token válido, o id do usuário fica em request.usuarioId.
 *******************************************************************************************/
const { verificarToken } = require('../service/token.js')

const protegerApi = function (request, response, next) {
    if (request.method === 'OPTIONS') return next()

    const cabecalho = request.headers.authorization || ''
    const token = request.headers['x-access-token'] || (/^Bearer\s+/i.test(cabecalho) ? cabecalho.replace(/^Bearer\s+/i, '') : '')

    // /auth/* é público, mas se vier um token válido (ex.: GET /auth/me) o id do usuário é lido do mesmo jeito
    if (request.path.startsWith('/auth/')) {
        try { if (token) request.usuarioId = verificarToken(token, 'acesso').sub }
        catch {
            // só /auth/me depende do token; nas demais rotas públicas um token ruim é ignorado
            if (request.path === '/auth/me') return response.status(401).json({ status: false, status_code: 401, message: 'Sessão inválida ou expirada.', codigo: 'TOKEN_INVALIDO' })
        }
        return next()
    }

    if (!token) {
        if (process.env.AUTH_OBRIGATORIA === 'true') {
            return response.status(401).json({ status: false, status_code: 401, message: 'Faça login para continuar.', codigo: 'NAO_AUTENTICADO' })
        }
        return next()
    }

    try {
        request.usuarioId = verificarToken(token, 'acesso').sub
        return next()
    } catch {
        return response.status(401).json({ status: false, status_code: 401, message: 'Sessão inválida ou expirada.', codigo: 'TOKEN_INVALIDO' })
    }
}

module.exports = { protegerApi }
