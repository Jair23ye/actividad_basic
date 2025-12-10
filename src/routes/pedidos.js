const express = require('express');
const router = express.Router();
const conection = require('../bd/db'); // Tu conexión a la base de datos

// (POST) Procesa el carrito temporal del frontend y lo registra en las tablas de la BD.
router.post('/', (req, res) => {
    // Asume que el frontend envía el array de ítems y el id_usuario
    const { items, id_usuario } = req.body; 

    // --- VALIDACIONES BÁSICAS ---
    if (!id_usuario) {
         // Si el usuario no está logueado o no se pasa el ID.
         return res.status(400).json({ error: 'El ID de usuario es obligatorio para crear un carrito.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'No se encontraron productos en el carrito para guardar.' });
    }

    // --- INICIO DE TRANSACCIÓN ---
    conection.beginTransaction(err => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).json({ error: 'Fallo interno al iniciar la transacción.' });
        }

        // PASO 1: Crear el encabezado del carrito (tabla 'carrito')
        const sqlCarrito = 'INSERT INTO carrito (usuario_id) VALUES (?)';
        conection.query(sqlCarrito, [id_usuario], (err, result) => {
            if (err) {
                return conection.rollback(() => {
                    console.error('Error al crear el encabezado del carrito:', err);
                    res.status(500).json({ error: 'Fallo al crear el registro principal del carrito.' });
                });
            }

            const carritoId = result.insertId; // ID del nuevo carrito (PASO 2)

            // PASO 3: Insertar los productos en la tabla 'carrito_items'
            // NOTA: 'items' viene del frontend y el ID del plato se llama 'id' en el frontend.
            const sqlItems = 'INSERT INTO carrito_items (carrito_id, menu_id, cantidad) VALUES ?';
            
            const itemValues = items.map(item => [
                carritoId,          // carrito_id (Referencia al encabezado)
                item.id,            // menu_id (ID del plato)
                item.cantidad       // cantidad
            ]);

            conection.query(sqlItems, [itemValues], (err, result) => {
                if (err) {
                    return conection.rollback(() => {
                        console.error('Error al insertar los items del carrito:', err);
                        res.status(500).json({ error: 'Fallo al registrar los productos del menú.' });
                    });
                }
                
                // Si todo fue bien, confirmar la transacción (Commit)
                conection.commit(err => {
                    if (err) {
                        return conection.rollback(() => {
                            console.error('Error al hacer commit:', err);
                            res.status(500).json({ error: 'Fallo al confirmar el pedido en la BD.' });
                        });
                    }
                    res.status(201).json({ 
                        message: 'Pedido registrado con éxito', 
                        id_carrito: carritoId 
                    });
                });
            });
        });
    });
});

module.exports = router;