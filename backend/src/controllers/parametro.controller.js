const connection = require('../connection');

const parametroController = {
    getParametros: async (req, res) => {
        try {
            const { tabla } = req.params;

            const results = await new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM ${tabla}`, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });

            // Enviar los resultados como respuesta
            res.json({ success: true, parametros: results });
        } catch (error) {
            console.error('Error al obtener los parámetros:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    borrarParametro: async (req, res) => {
        try {
            const { tabla, campo, valor } = req.params;

            const result = await new Promise((resolve, reject) => {
                connection.query(`DELETE FROM ${tabla} WHERE ${campo} = ?`, [valor], (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });

            // Comprobar si se borró algún registro
            if (result.affectedRows === 0) {
                res.status(404).json({ success: false, message: 'No se encontró ningún registro para borrar' });
                return;
            }

            // Enviar una respuesta exitosa
            res.json({ success: true, message: 'Registro borrado correctamente' });
        } catch (error) {
            console.error('Error al borrar el registro:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    editarNombreParametro: async (req, res) => {
        try {
            const { tabla, campo, valor, nuevoNombre } = req.params;

            const countResult = await new Promise((resolve, reject) => {
                connection.query(`SELECT COUNT(*) AS count FROM ${tabla} WHERE ${campo} = ? AND ${campo} <> ?`, [nuevoNombre, valor], (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });

            const count = countResult[0].count;
            // Si count es mayor que cero, significa que el nombre ya existe en la tabla
            if (count > 0) {
                res.status(400).json({ success: false, message: 'El nombre ingresado ya existe en la tabla' });
                return;
            }

            // Realizar la consulta SQL para modificar el nombre del registro
            const result = await new Promise((resolve, reject) => {
                connection.query(`UPDATE ${tabla} SET ${campo} = ? WHERE ${campo} = ?`, [nuevoNombre, valor], (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });

            // Comprobar si se modificó algún registro
            if (result.affectedRows === 0) {
                res.status(404).json({ success: false, message: 'No se encontró ningún registro para modificar' });
                return;
            }

            // Enviar una respuesta exitosa
            res.json({ success: true, message: 'Nombre del registro modificado correctamente' });
        } catch (error) {
            console.error('Error al modificar el nombre del registro:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
}
module.exports = parametroController;

/*getParametros: async (req, res) => {
        try {
            const query = `
                SELECT *, 'param_antivirus' AS tabla_origen FROM param_antivirus
                UNION ALL
                SELECT *, 'param_memoria' AS tabla_origen FROM param_memoria
                UNION ALL
                SELECT *, 'param_office' AS tabla_origen FROM param_office
                UNION ALL
                SELECT *, 'param_marcas' AS tabla_origen FROM param_marcas
                ORDER BY tabla_origen;
            `;
            connection.query(query, (error, results, fields) => {
                if (error) {
                    console.error('Error al obtener los parámetros:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                res.json({ success: true, parametros: results });
            });
        } catch (error) {
            console.error('Error al obtener los parámetros:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }   
    } */