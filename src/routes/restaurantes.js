const express = require('express');
const router = express.Router();
const conection = require('../bd/db');
// Nota: La importación de 'login' y la ruta '/login' fueron removidas, 
// ya que esta ruta debe enfocarse exclusivamente en el recurso 'restaurantes'.

// --- ENDPOINTS CRUD PARA RESTAURANTES ---

// (POST) Crear nuevo restaurante
router.post('/', (req, res) => {
    // Se extraen todos los 11 campos de la tabla de restaurantes
    const { nombre, descripcion, email, telefono, direccion, lat, lng, tiempo_entrega_min, tiempo_entrega_max, rating_promedio, estado } = req.body;
    
    const sql = 'INSERT INTO restaurantes(nombre, descripcion, email, telefono, direccion, lat, lng, tiempo_entrega_min, tiempo_entrega_max, rating_promedio, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    conection.query(sql, [nombre, descripcion, email, telefono, direccion, lat, lng, tiempo_entrega_min, tiempo_entrega_max, rating_promedio, estado], (err, result) => {
        if (err) {
            console.error('Error al crear el restaurante:', err);
            return res.status(500).json({ error: 'Error interno al crear el restaurante' });
        }
        // Devuelve el ID insertado junto con los datos para confirmación
        res.status(201).json({ 
            id: result.insertId,
            nombre,
            descripcion,
            email,
            telefono,
            direccion,
            lat,
            lng,
            tiempo_entrega_min,
            tiempo_entrega_max,
            rating_promedio,
            estado
        });
    });
});

// (GET) Obtener todos los restaurantes
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM restaurantes';
    conection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener los restaurantes:', err);
            return res.status(500).json({ error: 'Error interno al obtener los restaurantes' });
        }
        res.json(results);
    });
});

// (GET) Obtener un restaurante por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    // CORRECCIÓN: Se consulta la tabla 'restaurantes' (antes era 'usuarios')
    const sql = 'SELECT * FROM restaurantes WHERE id = ?';
    
    conection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el restaurante:', err);
            return res.status(500).json({ error: 'Error interno al obtener el restaurante' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.json(results[0]);
    });
});

// (PUT) Actualizar un restaurante por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    // Se extraen y usan todos los 11 campos de la tabla de restaurantes
    const { nombre, descripcion, email, telefono, direccion, lat, lng, tiempo_entrega_min, tiempo_entrega_max, rating_promedio, estado } = req.body;
    
    // CORRECCIÓN: Se actualiza la tabla 'restaurantes' (antes era 'usuarios') y se usan todos los campos correctos
    const sql = `
        UPDATE restaurantes 
        SET nombre = ?, descripcion = ?, email = ?, telefono = ?, direccion = ?, lat = ?, lng = ?, 
            tiempo_entrega_min = ?, tiempo_entrega_max = ?, rating_promedio = ?, estado = ?
        WHERE id = ?
    `;
    
    const values = [nombre, descripcion, email, telefono, direccion, lat, lng, tiempo_entrega_min, tiempo_entrega_max, rating_promedio, estado, id];

    conection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el restaurante:', err);
            return res.status(500).json({ error: 'Error interno al actualizar el restaurante' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurante no encontrado para actualizar' });
        }
        res.json({ message: 'Restaurante actualizado correctamente' });
    });
});

// (DELETE) Eliminar un restaurante por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    // CORRECCIÓN: Se elimina de la tabla 'restaurantes' (antes era 'usuarios')
    const sql = 'DELETE FROM restaurantes WHERE id = ?';
    
    conection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el restaurante:', err);
            return res.status(500).json({ error: 'Error interno al eliminar el restaurante' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurante no encontrado para eliminar' });
        }
        res.json({ message: 'Restaurante eliminado correctamente' });
    });
});

module.exports = router;