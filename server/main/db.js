const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'urbantreeconservation.cdeosts5l1qu.us-east-2.rds.amazonaws.com',
  database: 'postgres',
  password: 'postgres',
  post: 5432
})

module.exports = pool