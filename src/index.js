const connection = require("./bd/db");


connection.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos con ID:', connection.threadId);
});
