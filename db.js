const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password:"PassMe12@",
  port: 5432, // default Postgres port
  database: 'schooldb'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};