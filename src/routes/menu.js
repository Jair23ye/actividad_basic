const express = require('express');
const router = express.Router();
const conection = require('../bd/db');

// --- ENDPOINTS CRUD PARA MENÚ ---

// (POST) Crear nuevo plato
// Incluye el restaurante_id, el cual es crucial para esta relación.
router.post('/', (req, res) => {
    // Campos esperados desde el frontend (incluyendo el ID del restaurante)
    const {
        restaurante_id, nombre, descripcion, precio, calorias, proteinas,
        es_saludable, disponible
    } = req.body;

    // Aseguramos que el restaurante_id y el nombre estén presentes
    if (!restaurante_id || !nombre || precio === undefined) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: restaurante_id, nombre o precio.' });
    }

    const sql = `
        INSERT INTO menu (restaurante_id, nombre, descripcion, precio, calorias, proteinas, es_saludable, disponible) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        restaurante_id, nombre, descripcion, precio, calorias || null, proteinas || null,
        es_saludable || 0, disponible || 1
    ]; // Usamos null o valores por defecto para los opcionales

    conection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al crear el plato:', err);
            return res.status(500).json({ error: 'Error interno al crear el plato' });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// (GET) Obtener TODOS los platos de un restaurante específico
// Esta es la ruta especial que el frontend usa para cargar la tabla de menú.
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM menu ORDER BY id ASC';

    conection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener todos los platos:', err);
            return res.status(500).json({ error: 'Error interno al obtener el menú completo' });
        }
        // Devuelve un array con todos los platos.
        res.json(results);
    });
});

// (GET) Obtener un plato por ID (para edición si fuera necesario)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM menu WHERE id = ?';

    conection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el plato:', err);
            return res.status(500).json({ error: 'Error interno al obtener el plato' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Plato no encontrado' });
        }
        res.json(results[0]);
    });
});

// (PUT) Actualizar un plato por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre, descripcion, precio, calorias, proteinas,
        es_saludable, disponible, restaurante_id // Se permite actualizar el restaurante_id (opcional)
    } = req.body;

    const sql = `
        UPDATE menu 
        SET nombre = ?, descripcion = ?, precio = ?, calorias = ?, proteinas = ?, 
            es_saludable = ?, disponible = ? 
            ${restaurante_id ? ', restaurante_id = ?' : ''}
        WHERE id = ?
    `;

    // Construye dinámicamente el array de valores
    const values = [
        nombre, descripcion, precio, calorias || null, proteinas || null,
        es_saludable || 0, disponible || 1
    ];
    if (restaurante_id) {
        values.push(restaurante_id);
    }
    values.push(id);

    conection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el plato:', err);
            return res.status(500).json({ error: 'Error interno al actualizar el plato' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Plato no encontrado para actualizar' });
        }
        res.json({ message: 'Plato actualizado correctamente' });
    });
});

// (DELETE) Eliminar un plato por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM menu WHERE id = ?';

    conection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el plato:', err);
            return res.status(500).json({ error: 'Error interno al eliminar el plato' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Plato no encontrado para eliminar' });
        }
        res.json({ message: 'Plato eliminado correctamente' });
    });
});

module.exports = router;