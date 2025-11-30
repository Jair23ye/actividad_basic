const express = require('express');
const router = express.Router();
const conection = require('../bd/db');
// const { login } = require('../controllers/usercontroller'); // Descomentar si usas un controlador

// --- ENDPOINTS CRUD PARA USUARIOS ---
// (POST) Crear nuevo usuario
router.post('/', (req, res) => {
    // Campos de la tabla usuarios (basado en tu estructura anterior)
    const { nombre, apellido, email, telefono, password_hash, fecha_registro, tipo, estado } = req.body;
    
    const sql = 'INSERT INTO usuarios(nombre, apellido, email, telefono, password_hash, fecha_registro, tipo, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
    
    // Nota: Es mejor práctica hashear el password antes de insertar. Aquí se usa el valor directo.
    conection.query(sql, [nombre, apellido, email, telefono, password_hash, fecha_registro, tipo, estado], (err, result) => {
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
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    // Lista de campos que se pueden actualizar. password_hash solo si se envía.
    const allowedFields = ['nombre', 'apellido', 'email', 'telefono', 'password_hash', 'fecha_registro', 'tipo', 'estado'];
    
    let updateFields = [];
    let values = [];
    
    for (const field of allowedFields) {
        if (updates.hasOwnProperty(field)) {
            let valueToSet = updates[field];
            
            // --- CORRECCIÓN EN EL TRATAMIENTO DEL CAMPO 'TIPO' ---
            if (field === 'tipo') {
                // ASUME que la base de datos espera una CADENA DE TEXTO para 'tipo'.
                // Reemplaza 'usuario' y 'administrador' con los valores exactos de tu ENUM o VARCHAR.
                if (valueToSet === 0 || valueToSet === 'usuario') {
                    valueToSet = 'usuario'; // O el valor que corresponda al 0
                } else if (valueToSet === 1 || valueToSet === 'administrador') {
                    valueToSet = 'administrador'; // O el valor que corresponda al 1
                } else {
                    // Si viene un valor que no es 0 ni 1, lo dejamos como viene (si es que viene como cadena)
                    // Si tu frontend envía el ID numérico, probablemente solo necesites el bloque de arriba.
                }
            }
            // --------------------------------------------------------

            // TRATAMIENTO DE BOOLEANOS/ESTADOS (asumiendo 1/0, si la columna 'estado' es TINYINT)
            if (field === 'estado') {
                 // Si 'estado' es un TINYINT(1) que espera 1 o 0
                 valueToSet = (valueToSet === true || valueToSet === 1 || valueToSet === '1') ? 1 : 0;
            }

            updateFields.push(`${field} = ?`);
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