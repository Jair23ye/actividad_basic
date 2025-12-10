const express = require('express');
const router = express.Router();
const conection = require('../bd/db');
const jwt = require('jsonwebtoken'); // 👈 ¡IMPORTAR JSONWEBTOKEN!

// Clave secreta para firmar los tokens (¡Cámbiala en un entorno real!)
const JWT_SECRET = 'tu_clave_super_secreta_e_insegura_para_dev'; 

// Endpoint de LOGIN
// Montado en: POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body; 

    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    // 1. Buscar el usuario por email Y contraseña
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND password_hash = ?';
    
    try {
        // Usamos .promise().query para asegurar que la conexión se maneja como promesa
        const [rows] = await conection.promise().query(sql, [email, password]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // --- AUTENTICACIÓN EXITOSA ---
        
        // 2. GENERAR EL TOKEN JWT
        // El payload debe contener la información necesaria para futuras validaciones (ej: id y tipo)
        const token = jwt.sign(
            { id: user.id, email: user.email, tipo: user.tipo }, 
            JWT_SECRET, 
            { expiresIn: '1h' } // Token expira en 1 hora
        );
        
        // 3. ENVIAR EL TOKEN Y EL ID DEL USUARIO
        const { password_hash, ...userData } = user; 
        
        res.json({ 
            success: true, 
            message: 'Inicio de sesión exitoso.',
            token: token, // 👈 ¡AQUÍ ESTÁ EL TOKEN QUE NECESITA EL FRONTEND!
            user: userData
        });

    } catch (err) {
        console.error('Error durante el inicio de sesión:', err);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;