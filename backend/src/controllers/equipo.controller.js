const connection = require('../connection');

const equipoController = {
    getEquipos: async (req, res) => {
        //WHERE nom_custodio = "LIBRE"
        connection.query('SELECT * FROM equipo ORDER BY fec_reg DESC', (error, results) => {
            if (error) {
                console.error('Error al obtener equipos:', error);
                res.status(500).json({ success: false, message: 'Error al obtener los equipos de BDD' });
            } else {
                res.status(200).json({ success: true, equipos: results });
            }
        });
    }
};

module.exports = equipoController;