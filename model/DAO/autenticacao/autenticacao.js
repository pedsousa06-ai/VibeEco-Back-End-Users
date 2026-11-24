/*******************************************************************************************
 * Objetivo: consultas de autenticação do usuário (login, recuperação e troca de senha)
 *******************************************************************************************/
const knex = require('knex')
const knexConfig = require('../../database_config_knex/knex_file.js')
const knexConex = knex(knexConfig.development)

const primeira = (result) => (Array.isArray(result) && Array.isArray(result[0]) ? result[0][0] ?? null : null)

// login por e-mail OU matrícula
const buscarPorLogin = async function (login) {
    try {
        return primeira(await knexConex.raw(
            `SELECT u.id, u.nome, u.email, u.matricula, u.senha, COALESCE(s.is_active, 1) AS ativo
               FROM tbl_usuario u
               LEFT JOIN tbl_status s ON s.id = u.id_status
              WHERE LOWER(u.email) = LOWER(?) OR u.matricula = ?
              LIMIT 1`, [login, login]))
    } catch (error) { console.log(error); return false }
}

const buscarPorId = async function (id) {
    try {
        return primeira(await knexConex.raw(
            `SELECT id, nome, email, matricula FROM tbl_usuario WHERE id = ? LIMIT 1`, [Number(id)]))
    } catch (error) { console.log(error); return false }
}

// guarda o hash do código e a validade (15 min, calculada pelo próprio MySQL)
const salvarCodigo = async function (id, codigoHash) {
    try {
        await knexConex.raw(
            `UPDATE tbl_usuario SET codigo_recuperacao = ?, codigo_expiracao = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE id = ?`,
            [codigoHash, Number(id)])
        return true
    } catch (error) { console.log(error); return false }
}

// devolve { codigo_recuperacao, valido } onde valido = ainda não expirou
const buscarCodigo = async function (id) {
    try {
        return primeira(await knexConex.raw(
            `SELECT codigo_recuperacao, (codigo_expiracao IS NOT NULL AND codigo_expiracao > NOW()) AS valido
               FROM tbl_usuario WHERE id = ?`, [Number(id)]))
    } catch (error) { console.log(error); return false }
}

const limparCodigo = async function (id) {
    try {
        await knexConex.raw(`UPDATE tbl_usuario SET codigo_recuperacao = NULL, codigo_expiracao = NULL WHERE id = ?`, [Number(id)])
        return true
    } catch (error) { console.log(error); return false }
}

const atualizarSenha = async function (id, senhaHash) {
    try {
        await knexConex.raw(
            `UPDATE tbl_usuario SET senha = ?, codigo_recuperacao = NULL, codigo_expiracao = NULL WHERE id = ?`,
            [senhaHash, Number(id)])
        return true
    } catch (error) { console.log(error); return false }
}

module.exports = { buscarPorLogin, buscarPorId, salvarCodigo, buscarCodigo, limparCodigo, atualizarSenha }
