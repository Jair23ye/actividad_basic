const mysql = require('mysql2');

  const conection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ojotutupiche34',
    database: 'green_bite',
  });

  conection.connect(err => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err.stack);
      return;
    }
    console.log('Conectado a la base de datos con ID:', conection.threadId);
  });

module.exports = conection;
