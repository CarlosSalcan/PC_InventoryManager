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
                        REPLACE(REPLACE(tip_equipo, 'Computador de ', ''), 'Computador ', '') AS tip_equipo,
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
    }
};

module.exports = equipoController;

