require('dotenv').config('./config/db');
const mysql = require('mysql2',"mysql2/promise");
// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // Host do banco de dados
  user: process.env.DB_USER,         // Usuário do MySQL
  password: process.env.DB_PASSWORD, // Senha do MySQL
  database: process.env.DB_NAME,     // Nome do banco de dados
  port: process.env.DB_PORT || 3306,         // Porta do MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 segundos
});

const db = pool.promise();

db.getConnection()
  .then(() => console.log('Conectado ao banco de dados MySQL!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));
// module.exports = connection;

module.exports = db;