const { query } = require('express');
const connection = require('../connection');
//const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado

const userController = {
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;
    
            console.log('Datos recibidos:', { username, password });

            // Buscar el usuario en la base de datos por su nombre de usuario
            const query = 'SELECT * FROM usuario WHERE id = ?';
            const user = await new Promise((resolve, reject) => {
                connection.query(query, [username], (error, results) => {
                    if (error) {
                        console.error('Error en la consulta:', error);
                        reject(error);
                        return;
                    }
                    console.log('Resultados de la consulta:', results);
                    resolve(results[0]); // Solo esperamos un resultado
                });
            });
    
            // Verificar si el usuario existe
            if (!user) {
                console.log('Usuario no encontrado');
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }
    
            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log('Contraseña incorrecta');
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }
    
            // Usuario autenticado correctamente
            res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', user: user });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
};

module.exports = userController;
