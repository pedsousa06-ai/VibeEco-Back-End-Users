module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'bcd127',
      database: 'db_vibeEco_2026',
      port: 3306,
      charset: 'utf8mb4_0900_ai_ci', // <-- AQUI: charset com a collation correta
      typeCast: true
    },
    pool: { min: 0, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};