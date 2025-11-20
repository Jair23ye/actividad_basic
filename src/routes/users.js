const express = require('express');
const router = express.Router();
const conection = require('../bd/db');
//import conection from '../bd/db';

// (POST)
router.post('/', (req, res) => {
  const { nombre,apellido, correo,telefono,direccion,fecha_registro } = req.body;
  const sql = 'insert into clientes(nombre,apellido,correo,telefono,direccion,fecha_registro) values(?,?,?,?,?,?)';
  conection.query(sql, [nombre,apellido, correo,telefono,direccion,fecha_registro], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
    res.json({ id: result.insertId, nombre,apellido, correo,telefono,direccion,fecha_registro});
  });
});

//  (GET todos)
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM clientes';
  conection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
    res.json(results);
  });
});

// READ (GET uno)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM usuarios WHERE id = ?';
  conection.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
    res.json(results[0]);
  });
});

// UPDATE (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;
  const sql = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
  conection.query(sql, [nombre, email, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  conection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  });
});

module.exports = router;
