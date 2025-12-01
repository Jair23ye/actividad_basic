const db = require('../bd/db'); // Tu conexión a la DB

const login = async (req, res) => {
    // 1. Obtener email y contraseña del cuerpo de la petición
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Faltan campos: email y password son requeridos.' });
    }

    try {
        // 2. Buscar el usuario por email
        // El campo en tu tabla es 'password_hash', pero lo usaremos para la contraseña en texto plano.
        const [rows] = await db.query('SELECT id, nombre, email, password_hash, tipo, estado FROM usuarios WHERE email = ?', [email]);
        
        // Verificar si el usuario existe
        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
        }

        const usuario = rows[0];
        
        // 3. Verificar la contraseña (Comparación simple en texto plano)
        // La contraseña enviada (password) se compara directamente con el valor almacenado (password_hash)
        const esValida = (password === usuario.password_hash);

        if (!esValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
        }
        
        // **Verificar estado de cuenta**
        if (usuario.estado !== 'activo') {
             return res.status(403).json({ mensaje: 'Cuenta inactiva o baneada.' });
        }

        // 4. Enviar la respuesta exitosa
        res.json({ 
            mensaje: 'Login exitoso', 
            usuario: { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                email: usuario.email,
                tipo: usuario.tipo 
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = {
    login
};