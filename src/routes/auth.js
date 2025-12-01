const express = require('express');
const router = express.Router();
const conection = require('../bd/db');
// Se elimina la dependencia de bcrypt, ya que no se utilizará para encriptación.
// const bcrypt = require('bcrypt');

// Endpoint de LOGIN
// Montado en: POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // El password ahora se envía en texto plano

    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    // 1. Buscar el usuario por email Y contraseña (SIN HASHEAR)
    // ADVERTENCIA: Esta es una práctica insegura. La columna password_hash DEBE contener ahora la contraseña en texto plano.
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND password_hash = ?';
    
    try {
        const [rows] = await conection.promise().query(sql, [email, password]);
        const user = rows[0];

        if (!user) {
            // Falla si el email no existe O si la contraseña no coincide
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Autenticación exitosa
        
        // Excluir el campo de contraseña de la respuesta
        const { password_hash, ...userData } = user; 
        
        // Devolvemos los datos del usuario (excepto la contraseña)
        res.json({ 
            success: true, 
            message: 'Inicio de sesión exitoso.',
            user: userData
        });

    } catch (err) {
        console.error('Error durante el inicio de sesión:', err);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Nota: Se ha eliminado la ruta '/register' que manejaba la encriptación. 
// La creación de usuarios debe realizarse ahora a través de tu ruta POST /api/usuarios.

module.exports = router;