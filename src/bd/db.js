const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ojotutupiche34',
  database: 'employees'
});

module.exports = connection;
