const db = require('../bd/db');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (rows.length === 0) {
        return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    if (usuario.password_hash !== password) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // aquí normalmente va JWT pero lo dejamos simple
    res.json({
        message: "Login exitoso",
        token: "TOKEN_PROVISIONAL"
    });
};
