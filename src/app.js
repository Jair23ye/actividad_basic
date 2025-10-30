const express = require('express');
const app = express();
const db = require('./bd/db'); 
const conecction = require('./')

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

