const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path'); // Se agrega path para un manejo correcto de rutas estáticas

const db = require('./bd/db');
const usariosRoute = require('./routes/users');
// Importa las rutas para Restaurantes y Menú
const restaurantesRoute = require('./routes/restaurantes');
const menuRoute = require('./routes/menu');

const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
// Se recomienda usar 'path.join' para asegurar la compatibilidad entre sistemas operativos.
// Al usar la ruta raíz '/', el frontend se accederá en http://localhost:3000/
// Coloca admin_dashboard.html (o index.html) dentro de la carpeta 'public'.
app.use(express.static(path.join(__dirname, 'public')));


// 2. CONFIGURACIÓN DE RUTAS DE LA API (Añadiendo el prefijo '/api')
// El frontend espera que los endpoints de CRUD estén bajo '/api/recurso'.

// Rutas de Usuarios: http://localhost:3000/api/usuarios
app.use('/api/usuarios', usariosRoute);

// Rutas de Restaurantes: http://localhost:3000/api/restaurantes
app.use('/api/restaurantes', restaurantesRoute);

// Rutas del Menú: http://localhost:3000/api/menu
app.use('/api/menu', menuRoute);


// Middleware para manejar 404
app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).send('404 - Recurso no encontrado');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}
);