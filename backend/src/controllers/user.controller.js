const { query } = require('express');
const connection = require('../connection');

const userController = {
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Verificar si el usuario existe en la base de datos
            const query = 'SELECT * FROM usuario WHERE id = ? AND clave = ?';
            connection.query(query, [username, password], (error, results, fields) => {
                if (error) {
                    console.error('Error en la consulta:', error);
                    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
                }

                if (results.length === 1) {
                    // Si el usuario y la contraseña son correctos, enviar una respuesta exitosa
                    return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
                } else {
                    // Si el usuario o la contraseña son incorrectos, enviar un mensaje de error
                    return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
                }
            });
        } catch (error) {
            console.error('Error en el login:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
};

module.exports = userController;
