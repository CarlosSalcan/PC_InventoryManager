const connection = require('../connection');

const equipoController = {
    getEquipos: async (req, res) => {
        try {
            const equipos = await new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM equipo`, (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });

            res.status(200).json({ success: true, equipos: equipos });
        } catch (error) {
            console.error('Error al obtener equipos:', error);
            res.status(500).json({ success: false, message: 'Error al obtener los equipos de BDD' });
        }
    },

    obtenerOpcSelect: async (req, res) => {
        try {
            const { tabla, campo } = req.params;

            const query = `SELECT ${campo} FROM ${tabla}`;

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

    modificarEquipo: async (req, res) => {
        try {
            const { codEquipo, nuevoCodAlmacen, nuevoTipoEquipo, nuevoPiso, nuevoDepartamento, nuevoTitular } = req.body;
            const query = `
                UPDATE equipo
                SET 
                    cod_almacen =?, 
                    tip_equipo =?, 
                    piso_ubic =?, 
                    serv_depar =?, 
                    nom_custodio =? 
                WHERE cod_equipo = ?`;

            await new Promise((resolve, reject) => {
                connection.query(query, [nuevoCodAlmacen, nuevoTipoEquipo, nuevoPiso, nuevoDepartamento, nuevoTitular, codEquipo], (error, results, fields) => {
                    if (error) {
                        console.error('Error al guardar cambios en el equipo:', error);
                        res.status(500).json({ success: false, message: 'Error interno del servidor' });
                        return;
                    }
                    res.json({ success: true, message: 'Cambios guardados correctamente' });
                });
            });
        } catch (error) {
            console.error('Error al guardar cambios en el equipo:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    getEquipoById: async (req, res) => {
        try {
            const { id } = req.params;
            const results = await new Promise((resolve, reject) => {
                connection.query('SELECT cod_equipo, piso_ubic, serv_depar, nom_custodio FROM equipo WHERE cod_equipo = ?', [id], (error, results, fields) => {
                    if (error) {
                        console.error('Error al obtener equipo por ID:', error);
                        reject(error);
                        return;
                    }

                    if (results.length === 0) {
                        res.status(404).json({ success: false, message: 'Equipo no encontrado' });
                        return;
                    }
                    resolve(results[0]);
                });
            });

            res.json({ success: true, equipo: results });
        } catch (error) {
            console.error('Error al obtener equipo por ID:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    enviarBodegaEquipo: async (req, res) => {
        try {
            const { id } = req.params;
            const { piso_ubic, serv_depar, nom_custodio } = req.body;
            console.log(id, nom_custodio, serv_depar, piso_ubic)

            await new Promise((resolve, reject) => {
                connection.query('UPDATE equipo SET piso_ubic = ?, serv_depar = ?, nom_custodio = ?  WHERE cod_equipo = ?', [piso_ubic, serv_depar, nom_custodio, id], (error, results, fields) => {
                    if (error) {
                        console.error('Error al enviar equipo a bodega:', error);
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });

            res.json({ success: true, message: 'Equipo modificado' });
        } catch (error) {
            console.error('Error al enviar equipo a bodega:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    obtenerDatosComponentes: async (req, res) => {
        try {
            const { tabla, codEquipo } = req.params;
            const query = `SELECT * FROM ${tabla} WHERE cod_equipo = ?`;
            const results = await new Promise((resolve, reject) => {
                connection.query(query, [codEquipo], (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                    console.log("SERVIDOR: ",query)
                });
            });

            if (results.length === 0) {
                res.status(404).json({ success: false, message: `No se encontraron datos para ${tabla} del equipo especificado` });
                return;
            }

            res.json({ success: true, [tabla]: results[0] });
        } catch (error) {
            console.error(`Error al obtener datos de ${tabla}:`, error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarCambiosCPU: async (req, res) => {
        try {
            const { codCPU, codEquipo, codTicsCPU, nuevaMarcaCPU, nuevoNumSerieCPU, nuevoMainboard, nuevoProcesador, nuevaVelocidadProcesador, nuevaRam, nuevoHDD, nuevoDispositivoOptico, redFija, redInalambrica, bluetooth, lectorTarjeta, sistemaOperativo, office, antivirus, nomAntivirus, verAntivirus, nomHost, nomUsuario, generacion, condicion, estado, observacion } = req.body;
            const query = `UPDATE cpu_equipo
                SET 
                    cod_cpu = ?, 
                    cod_equipo = ?,
                    cod_tics_cpu = ?,
                    mar_cpu = ?, 
                    ser_cpu = ?, 
                    tar_madre = ?, 
                    procesador = ?, 
                    velocidad = ?, 
                    memoria = ?, 
                    tam_hdd = ?, 
                    disp_optico = ?,
                    red_fija = ?,
                    red_inalam = ?,
                    bluetooth = ?,
                    lec_tarjeta = ?,
                    sis_ope = ?,
                    office = ?,
                    antivirus = ?,
                    nom_antivirus = ?,
                    ver_antivirus = ?,
                    nom_hots = ?,
                    nom_usuario = ?,
                    ip_equipo = ?,
                    con_cpu = ?,
                    est_cpu = ?,
                    observacion = ?
                WHERE cod_equipo = ?`;
            // Ejecuta la consulta con los datos recibidos
            connection.query(query, [codCPU, codEquipo, codTicsCPU, nuevaMarcaCPU, nuevoNumSerieCPU, nuevoMainboard, nuevoProcesador, nuevaVelocidadProcesador, nuevaRam, nuevoHDD, nuevoDispositivoOptico, redFija, redInalambrica, bluetooth, lectorTarjeta, sistemaOperativo, office, antivirus, nomAntivirus, verAntivirus, nomHost, nomUsuario, generacion, condicion, estado, observacion, codEquipo], (error, results, fields) => {
                if (error) {
                    console.error('Error al guardar cambios en el CPU:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                // Envía una respuesta exitosa
                res.json({ success: true, message: 'Cambios guardados correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar cambios en el CPU:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarCambiosMTR: async (req, res) => {
        try {
            const { codMTR, codEquipo, codTicsMTR, nuevaMarcaMTR, nuevoModeloMTR, nuevoNumSerieMTR, nuevoTamMTR, nuevaConMTR, nuevoEstMTR, nuevaObservacionMTR } = req.body;
            const query = `UPDATE monitor
                SET 
                    cod_monitor = ?,
                    cod_equipo = ?,
                    cod_tics_monitor = ?,
                    mar_monitor = ?,
                    mod_monitor = ?,
                    ser_monitor = ?,
                    tam_monitor = ?,
                    con_monitor = ?,
                    est_monitor = ?,
                    observacion = ?
                WHERE cod_equipo = ?`;
            // Ejecuta la consulta con los datos recibidos
            connection.query(query, [codMTR, codEquipo, codTicsMTR, nuevaMarcaMTR, nuevoModeloMTR, nuevoNumSerieMTR, nuevoTamMTR, nuevaConMTR, nuevoEstMTR, nuevaObservacionMTR, codEquipo], (error, results, fields) => {
                console.log('CONSULTA UPDATE VER: ',query);
                if (error) {
                    console.error('Error al guardar cambios en el MTR:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                // Envía una respuesta exitosa
                res.json({ success: true, message: 'Cambios guardados correctamente MTR' });
            });
        } catch (error) {
            console.error('Error al guardar cambios en el MTR:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarCambiosTCD: async (req, res) => {
        try {
            const { codTCD, codEquipo, codTicsTCD, nuevaMarcaTCD, nuevoModeloTCD, nuevoNumSerieMTR, nuevoTipoTCD, nuevoPuertoTCD, nuevaConTCD, nuevoEstTCD, nuevaObservacionTCD } = req.body;
            const query = `UPDATE teclado
                SET
                    cod_teclado = ?,
                    cod_equipo = ?, 
                    cod_tics_teclado = ?,
                    mar_teclado = ?,
                    mod_teclado = ?,
                    ser_teclado = ?,
                    tip_teclado = ?,
                    pue_teclado = ?,
                    con_teclado = ?,
                    est_teclado = ?,
                    obs_teclado = ?
                WHERE cod_equipo = ?`;
            // Ejecuta la consulta con los datos recibidos
            connection.query(query, [codTCD, codEquipo, codTicsTCD, nuevaMarcaTCD, nuevoModeloTCD, nuevoNumSerieMTR, nuevoTipoTCD, nuevoPuertoTCD, nuevaConTCD, nuevoEstTCD, nuevaObservacionTCD, codEquipo], (error, results, fields) => {
                if (error) {
                    console.error('Error al guardar cambios en el TCD:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                // Envía una respuesta exitosa
                res.json({ success: true, message: 'Cambios guardados correctamente TCD' });
            });
        } catch (error) {
            console.error('Error al guardar cambios en el TCD:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarCambiosMS: async (req, res) => {
        try {
            const { codMS, codEquipo, codTicsMS, nuevaMarcaMS, nuevoModeloMS, nuevoNumSerieMS, nuevoTipoMS, nuevoPuertoMS, nuevaConMS, nuevoEstMS, nuevaObservacionMS } = req.body;
            const query = `UPDATE mouse
                SET
                    cod_mouse = ?,
                    cod_equipo = ?, 
                    cod_tics_mouse = ?,
                    mar_mouse = ?,
                    mod_mouse = ?,
                    ser_mouse = ?,
                    tip_mouse = ?,
                    pue_mouse = ?,
                    con_mouse = ?,
                    est_mouse = ?,
                    obs_mouse = ?
                WHERE cod_equipo = ?`;
            // Ejecuta la consulta con los datos recibidos
            connection.query(query, [ codMS, codEquipo, codTicsMS, nuevaMarcaMS, nuevoModeloMS, nuevoNumSerieMS, nuevoTipoMS, nuevoPuertoMS, nuevaConMS, nuevoEstMS, nuevaObservacionMS, codEquipo], (error, results, fields) => {
                if (error) {
                    console.error('Error al guardar cambios en el MS:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor ms' });
                    return;
                }
                // Envía una respuesta exitosa
                res.json({ success: true, message: 'Cambios guardados correctamente MS' });
            });
        } catch (error) {
            console.error('Error al guardar cambios en el MS:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    getNextCodEquipo: async (req, res) => {
        try {
            const query = `SHOW TABLE STATUS LIKE 'equipo'`;
            const results = await new Promise((resolve, reject) => {
                connection.query(query, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });
    
            if (results.length > 0) {
                const nextCodEquipo = results[0].Auto_increment;
                res.json({ success: true, nextCodEquipo });
            } else {
                res.status(404).json({ success: false, message: 'No se pudo obtener el próximo código de equipo' });
            }
        } catch (error) {
            console.error('Error al obtener el próximo código de equipo:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }    
};

module.exports = equipoController;
