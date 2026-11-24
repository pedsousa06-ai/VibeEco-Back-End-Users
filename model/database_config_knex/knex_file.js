// Lê o arquivo .env (se existir): dotenv quando instalado, senão o leitor nativo do Node 20.12+
try { require('dotenv').config() } catch {
  try { if (typeof process.loadEnvFile === 'function') process.loadEnvFile() } catch { /* sem .env: usa os valores padrão abaixo */ }
}

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'bcd127',
      database: process.env.DB_NAME || 'db_vibeEco_2026',
      port: Number(process.env.DB_PORT) || 3306,
      charset: 'utf8mb4_0900_ai_ci',
      typeCast: true
    },
    pool: { min: 0, max: 10 },
    migrations: { tableName: 'knex_migrations', directory: './db/migrations' },
    seeds: { directory: './db/seeds' }
  }
};
