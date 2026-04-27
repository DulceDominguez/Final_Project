const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd_dulceria'
});

db.connect(err => {
    if (err) {
        console.error('Error de conexion: ', err);
    }
    console.log('Conexion exitosa a MySQL')
});

module.exports = db;