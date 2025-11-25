const express = require('express');
const router = express.Router();
const conection = require('../bd/db');
//import conection from '../bd/db';

const { login } = require('../controllers/usercontroller');



router.post('/login', login);

// (POST)
router.post('/', (req, res) => {
  const { nombre, apellido, email, telefono, password_hash ,fecha_registro,tipo, estado } = req.body;
  const sql = 'insert into usuarios(nombre,apellido,email,telefono,password_hash,fecha_registro,tipo,estado) values(?,?,?,?,?,?,?,?)';
  conection.query(sql, [nombre, apellido, email, telefono, password_hash ,fecha_registro,tipo, estado], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
    res.json({ id: result.insertId, nombre, apellido, email, telefono, password_hash ,fecha_registro,tipo, estado });
  });
});

//  (GET todos)
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM usuarios';
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
  const sql = 'SELECT * FROM usuarios WHERE id= ?';
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
  const { nombre, apellido,email,telefono,password_hash,fecha_registro,tipo,estado } = req.body;
  const sql = 'UPDATE usuarios SET nombre= ?, apellido = ?, email= ?, telefono= ?, password_hash= ?, fecha_registro= ?, tipo= ?, estado= ? WHERE id = ?';
  conection.query(sql, [nombre, apellido,email,telefono,password_hash,fecha_registro,tipo,estado,id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  conection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
    console.log(id);
    res.json({ message: 'usuario eliminado correctamente ✊🏻✊🏻' });
  });
});

module.exports = router;
