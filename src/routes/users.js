const express = require('express');
const router = express.Router();
const conection = require('../bd/db');
// const { login } = require('../controllers/usercontroller'); // Descomentar si usas un controlador

// --- ENDPOINTS CRUD PARA USUARIOS ---
// (POST) Crear nuevo usuario
router.post('/', (req, res) => {
    // Campos de la tabla usuarios (basado en tu estructura anterior)
    const { nombre, apellido, email, telefono, password_hash, tipo, estado } = req.body;

    const sql = 'INSERT INTO usuarios(nombre, apellido, email, telefono, password_hash, tipo, estado) VALUES(?, ?, ?, ?, ?, ?, ?)';

    // Nota: Es mejor práctica hashear el password antes de insertar. Aquí se usa el valor directo.
    conection.query(sql, [nombre, apellido, email, telefono, password_hash, tipo, estado], (err, result) => {
        if (err) {
            console.error('Error al crear el usuario:', err);
            return res.status(500).json({ error: 'Error interno al crear el usuario' });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// (GET) Obtener todos los usuarios
router.get('/', (req, res) => {
    // Nota: Por seguridad, evita seleccionar el password_hash en consultas GET de lista.
    const sql = 'SELECT id, nombre, apellido, email, telefono, fecha_registro, tipo, estado FROM usuarios';
    conection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            return res.status(500).json({ error: 'Error interno al obtener los usuarios' });
        }
        res.json(results);
    });
});

// (GET) Obtener un usuario por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    // Nota: Por seguridad, evita seleccionar el password_hash
    const sql = 'SELECT id, nombre, apellido, email, telefono, fecha_registro, tipo, estado FROM usuarios WHERE id = ?';

    conection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el usuario:', err);
            return res.status(500).json({ error: 'Error interno al obtener el usuario' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(results[0]);
    });
});

// (PUT) Actualizar un usuario por ID - Versión Dinámica y Robusta
// usuarios.js (o donde tengas esta ruta)

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Lista de campos que se pueden actualizar.
    const allowedFields = ['nombre', 'apellido', 'email', 'telefono', 'password_hash', 'fecha_registro', 'tipo', 'estado'];

    let updateFields = [];
    let values = [];

    for (const field of allowedFields) {
        // 1. Verificar si el campo fue enviado en la solicitud
        if (updates.hasOwnProperty(field)) {
            let valueToSet = updates[field];

            // ==========================================================
            // === CORRECCIÓN CRÍTICA PARA 'TIPO' Y 'ESTADO' ===
            // ==========================================================
            
            if (field === 'tipo') {
                // Si el frontend envía un número (0, 1) o un valor booleano, lo forzamos a la cadena correcta
                if (valueToSet === 0 || valueToSet === false || valueToSet === 'usuario') {
                    valueToSet = 'usuario'; // Cadena esperada por la DB
                } else if (valueToSet === 1 || valueToSet === true || valueToSet === 'administrador') {
                    valueToSet = 'administrador'; // Cadena esperada por la DB
                }
                // Si ya es la cadena correcta (ej: 'cliente'), se mantiene.
            }

            if (field === 'estado') {
                // ELIMINAMOS EL 'RETURN' QUE ROMPÍA EL BUCLE DE CONSTRUCCIÓN SQL
                // Si el frontend envía un booleano, un número (0, 1) o una cadena 'true'/'false', lo convertimos.
                if (valueToSet === 1 || valueToSet === true || valueToSet === 'activo') {
                    valueToSet = 'activo'; // La cadena que MySQL espera
                } else if (valueToSet === 0 || valueToSet === false || valueToSet === 'inactivo') {
                    valueToSet = 'inactivo'; // La cadena que MySQL espera
                }
            }
            // ==========================================================

            // 2. Construir la parte SET de la consulta
            updateFields.push(`${field} = ?`);
            
            // 3. Agregar el valor a la lista de valores
            values.push(valueToSet);
        }
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar.' });
    }

    const sql = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id); // Agregar el ID al final

    conection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            // Mostrar los detalles del error al cliente para una mejor depuración (solo en desarrollo)
            return res.status(500).json({ error: 'Error interno al actualizar el usuario.', details: err.sqlMessage });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
        }
        res.json({ message: 'Usuario actualizado correctamente', id: id, changes: updates });
    });
});

// (DELETE) Eliminar un usuario por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM usuarios WHERE id = ?';

    conection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            return res.status(500).json({ error: 'Error interno al eliminar el usuario' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    });
});

module.exports = router;