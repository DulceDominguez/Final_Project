const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Si tienes contraseña en MySQL, ponla aquí
  database: 'bd_dulceria'
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a la BD:', err);
    return;
  }
  console.log('Conectado a la base de datos bd_dulceria');
});

module.exports = connection;