const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./bd/db'); 
//const conecction = require('./')
const usariosRoute = require('./routes/users')
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/usuarios', usariosRoute);
app.use('/public', express.static('public'));


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

