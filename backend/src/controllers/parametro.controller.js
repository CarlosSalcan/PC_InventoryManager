const connection = require('../connection');

const parametroController = {
    getParametros: async (req, res) => {
        try {
            // Obtener el nombre de la tabla desde los parámetros de la solicitud
            const { tabla } = req.params;
    
            // Realizar la consulta SQL para obtener los parámetros de la tabla especificada
            connection.query(`SELECT * FROM ${tabla}`, (error, results, fields) => {
                if (error) {
                    console.error('Error al obtener los parámetros:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
    
                // Enviar los resultados como respuesta
                res.json({ success: true, parametros: results });
            });
        } catch (error) {
            console.error('Error al obtener los parámetros:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
};

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