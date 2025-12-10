const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const db = require('./bd/db');
const usuariosRoute = require('./routes/users');
const restaurantesRoute = require('./routes/restaurantes');
const menuRoute = require('./routes/menu');
const authRoute = require('./routes/auth');
const pedidosRoute = require('./routes/pedidos'); // 👈 1. ¡IMPORTAR LA RUTA!

const PORT = 3000;

app.use(cors());
app.use(express.json()); // Middleware para parsear bodies JSON
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoute);
app.use('/api/usuarios', usuariosRoute);
app.use('/api/restaurantes', restaurantesRoute);
app.use('/api/menu', menuRoute);
app.use('/api/pedidos', pedidosRoute); // 👈 2. ¡REGISTRAR LA RUTA!

app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).send('404 - Recurso no encontrado');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Green Bite corriendo en el puerto ${PORT}`);
});