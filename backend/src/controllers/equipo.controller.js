const connection = require('../connection');

const equipoController = {
    getEquipos: async (req, res) => {
        connection.query('SELECT * FROM equipo WHERE nom_custodio != "libre" ORDER BY fec_reg DESC', (error, results) => {
            if (error) {
                console.error('Error al obtener equipos:', error);
                res.status(500).json({ success: false, message: 'Error al obtener los equipos de BDD' });
            } else {
                res.status(200).json({ success: true, equipos: results });
            }
        });
    },

    editarEquipo: async (req, res) => {
        const { id} = req.params; 
        const { nom_custodio, serv_depar, piso_ubic } = req.body;
    
        try {
            const query = 'UPDATE equipo SET piso_ubic = ?, serv_depar = ?, nom_custodio = ?  WHERE cod_equipo = ?';
            connection.query(query, ['SUBSUELO', 'BODEGA / ACTIVOS FIJOS', 'LIBRE', id], (error, results) => {
                if (error) {
                    console.error('Error al editar equipo:', error);
                    res.status(500).json({ success: false, message: 'Error al editar equipo' });
                } else {
                    res.status(200).json({ success: true, message: 'Equipo editado correctamente' });
                }
            });
        } catch (error) {
            console.error('Error al editar equipo:', error);
            res.status(500).json({ success: false, message: 'Error al editar equipo' });
        }
    }
};

module.exports = equipoController;