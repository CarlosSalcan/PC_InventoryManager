const connection = require('../connection');

const equipoController = {
    getEquipos: async (req, res) => {
        try {
            const equipos = await new Promise((resolve, reject) => {
                connection.query(`
                    SELECT 
                        cod_equipo,
                        fec_reg,
                        SUBSTRING(cod_almacen, 8) AS cod_almacen,
                        tip_equipo,
                        piso_ubic,
                        serv_depar,
                        nom_custodio,
                        nom_usua
                    FROM 
                        equipo
                    WHERE 
                        nom_custodio <> "libre"
                    `, (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    // Mapear los resultados para ajustar el formato de cod_almacen
                    const equipos = results.map(equipo => {
                        equipo.cod_almacen = equipo.cod_almacen.replace(/^[^-]*-/g, ''); // Eliminar la parte inicial hasta el primer guión
                        return equipo;
                    });

                    resolve(equipos);
                });
            });

            res.status(200).json({ success: true, equipos: equipos });
        } catch (error) {
            console.error('Error al obtener equipos:', error);
            res.status(500).json({ success: false, message: 'Error al obtener los equipos de BDD' });
        }
    },

    obtenerOpciones: async (req, res) => {
        try {
            const { tabla, campo } = req.params;

            const query = `SELECT ${campo} FROM ${tabla} WHERE ${campo} IS NOT NULL`;

            const results = await new Promise((resolve, reject) => {
                connection.query(query, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });

            const options = results.map(result => result[campo]);
            res.json({ success: true, options: options });
        } catch (error) {
            console.error('Error al obtener opciones:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    //--------------------------> Obtener ID Enviar Bodega
    getEquipoById: async (req, res) => {
        const { id } = req.params;
        connection.query('SELECT cod_equipo, piso_ubic, serv_depar, nom_custodio FROM equipo WHERE cod_equipo = ?', [id], (error, results, fields) => {
            if (error) {
                console.error('Error al obtener equipo por ID:', error);
                res.status(500).json({ success: false, message: 'Error interno del servidor' });
                return;
            }

            if (results.length === 0) {
                res.status(404).json({ success: false, message: 'Equipo no encontrado' });
                return;
            }

            const equipo = results[0]; // Tomamos el primer resultado ya que esperamos solo un equipo con un ID específico
            res.json({ success: true, equipo });
        });
    },

    enviarBodegaEquipo: async (req, res) => {
        const { id } = req.params;
        const { piso_ubic, serv_depar, nom_custodio } = req.body;
        console.log(id, nom_custodio, serv_depar, piso_ubic)

        //console.log(fecha, tipo_activo,codigo_activo,piso,servicio,custodio,usuario)
        connection.query('UPDATE equipo SET piso_ubic = ?, serv_depar = ?, nom_custodio = ?  WHERE cod_equipo = ?', [piso_ubic, serv_depar, nom_custodio, id], (error, results, fields) => {
            if (error) throw error;
            res.json({ success: true, message: 'Equipo modificado' });
        });
    }
};

module.exports = equipoController;

