const { query } = require('express');
const connection = require('../connection');

const equipoController = {
    getEquipos: async (req, res) => {
        try {
            const { tip_equipo } = req.query;

            const query = `SELECT * FROM equipo WHERE tip_equipo = ?`;
            const equipos = await new Promise((resolve, reject) => {
                connection.query(query, [tip_equipo], (error, results) => {
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
                    console.log("SERVIDOR: ", query)
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
                console.log('CONSULTA UPDATE VER: ', query);
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
            connection.query(query, [codMS, codEquipo, codTicsMS, nuevaMarcaMS, nuevoModeloMS, nuevoNumSerieMS, nuevoTipoMS, nuevoPuertoMS, nuevaConMS, nuevoEstMS, nuevaObservacionMS, codEquipo], (error, results, fields) => {
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

    guardarCambiosLaptop: async (req, res) => {
        try {
            const { codPTL, codEquipo, codTics, marca, modelo, serie, procesador, velocidad, memoria, hdd, dispOpt, red, wifi, bluethooth, tarjeta, sisOpe, office, antivirus, nomAnt, verAnt, host, usuario, estado, observacion } = req.body;
            const query = `UPDATE laptop
            SET 
            cod_laptop = ?, 
            cod_equipo = ?,
            cod_tics_laptop = ?,
                    mar_laptop = ?,  
                    mod_laptop = ?,
                    ser_laptop = ?,
                    pro_laptop = ?,
                    vel_laptop = ?, 
                    mem_laptop = ?, 
                    hdd_laptop = ?, 
                    dop_laptop = ?,
                    red_laptop = ?,
                    wif_laptop = ?,
                    blu_laptop = ?,
                    tar_laptop = ?,
                    so_laptop = ?,
                    off_laptop = ?,
                    antv_laptop= ?,
                    nom_antv_laptop = ?,
                    ver_antv_laptop = ?,
                    nom_hots_laptop = ?,
                    nom_usuario_laptop = ?,
                    est_laptop = ?,
                    observacion_laptop = ?
                    WHERE cod_equipo = ?`;
            // Ejecuta la consulta con los datos recibidos
            connection.query(query, [codPTL, codEquipo, codTics, marca, modelo, serie, procesador, velocidad, memoria, hdd, dispOpt, red, wifi, bluethooth, tarjeta, sisOpe, office, antivirus, nomAnt, verAnt, host, usuario, estado, observacion, codEquipo], (error, results, fields) => {
                if (error) {
                    console.error('Error al guardar cambios en el PLTS:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                // Envía una respuesta exitosa
                res.json({ success: true, message: 'Cambios guardados correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar cambios en el PLTS:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarCambiosImpresora: async (req, res) => {
        try {
            const { codIMP, codEquipo, codTics, marca, modelo, serie, tipo, puerto, condicion, ip, estado, observacion } = req.body;
            const query = `UPDATE impresora
            SET 
                    cod_impresora = ?, 
                    cod_equipo = ?,
                    cod_tics_impresora = ?,
                    mar_imp = ?,  
                    mod_imp = ?,
                    ser_imp = ?,
                    tip_imp = ?,
                    pue_imp = ?,
                    con_imp = ?,
                    ip_equipo_imp = ?,
                    est_imp = ?,
                    obs_imp = ?
                WHERE cod_equipo = ?`;
            // Ejecuta la consulta con los datos recibidos
            connection.query(query, [codIMP, codEquipo, codTics, marca, modelo, serie, tipo, puerto, condicion, ip, estado, observacion, codEquipo], (error, results, fields) => {
                if (error) {
                    console.error('Error al guardar cambios en el IMPS:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                // Envía una respuesta exitosa
                res.json({ success: true, message: 'Cambios guardados correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar cambios en el IMP:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarCambiosTelefono: async (req, res) => {
        try {
            const { codTLF, codEquipo, codTics, marca, modelo, serie, condicion, estado, observacion } = req.body;
            const query = `UPDATE telefono
            SET 
            cod_telf = ?, 
                    cod_equipo = ?,
                    cod_tics_telf = ?,
                    mar_telf = ?,  
                    mod_telf = ?,
                    ser_telf = ?,
                    con_telf = ?,
                    est_telf = ?,
                    obs_telf = ?
                WHERE cod_equipo = ?`;
            // Ejecuta la consulta con los datos recibidos
            connection.query(query, [codTLF, codEquipo, codTics, marca, modelo, serie, condicion, estado, observacion, codEquipo], (error, results, fields) => {
                if (error) {
                    console.error('Error al guardar cambios en el TLFS:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                // Envía una respuesta exitosa
                res.json({ success: true, message: 'Cambios guardados correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar cambios en el TLF:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    getEquiposReporte: async (req, res) => {
        try {
            const results = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM equipo', (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
            res.status(200).json({ success: true, equipos: results });
        } catch (error) {
            console.error('Error al obtener equiposR:', error);
            res.status(500).json({ success: false, message: 'Error al obtener los equiposR de BDD' });
        }
    },

    buscarEquipos: async (req, res) => {
        try {
            let { tipoEquipo, query } = req.params;

            // Verificar si se proporcionó un tipo de equipo
            let sqlQuery;
            let values;
            if (tipoEquipo === 'todos') {
                // Si no se proporciona un tipo de equipo, buscar en todos los tipos
                sqlQuery = `
                SELECT * FROM equipo
                    WHERE 
                        cod_equipo LIKE ? 
                        OR fec_reg LIKE ?
                        OR cod_almacen LIKE ?
                        OR piso_ubic LIKE ?
                        OR serv_depar LIKE ?
                        OR nom_custodio LIKE ?
                        OR nom_usua LIKE ?`;
                values = Array(7).fill(`%${query}%`);
            } else {
                // Si se proporciona un tipo de equipo, buscar solo en ese tipo
                sqlQuery = `
                SELECT * FROM equipo
                WHERE tip_equipo = ? AND (
                        cod_equipo LIKE ? 
                        OR fec_reg LIKE ?
                        OR cod_almacen LIKE ?
                        OR piso_ubic LIKE ?
                        OR serv_depar LIKE ?
                        OR nom_custodio LIKE ?
                        OR nom_usua LIKE ?)`;
                values = [tipoEquipo, ...Array(7).fill(`%${query}%`)];
            }

            const results = await new Promise((resolve, reject) => {
                connection.query(sqlQuery, values, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });

            // Enviar los resultados como respuesta
            res.json({ success: true, equipos: results });
        } catch (error) {
            console.error('Error al buscar los equipos:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    //-------------------------------> GUARDAR NUEVO EQUIPO
    nuevoEquipo: async (req, res) => {
        try {
            // Extraer los datos del cuerpo de la solicitud
            const { cod_equipo, fec_reg, cod_almacen, tip_equipo, piso_ubic, serv_depar, nom_custodio } = req.body;

            // Verificar si ya existe un registro con el mismo cod_almacen
            const existeRegistroQuery = 'SELECT COUNT(*) AS numRegistros FROM equipo WHERE cod_almacen = ?';
            connection.query(existeRegistroQuery, [cod_almacen], (error, results, fields) => {
                if (error) {
                    console.error('Error al verificar el registro existente:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                const numRegistros = results[0].numRegistros;
                if (numRegistros > 0) {
                    res.status(400).json({ success: false, message: 'Ya existe un equipo con el mismo código de almacén' });
                    return;
                }

                // Realizar la inserción del nuevo equipo en la base de datos
                const query = 'INSERT INTO equipo (cod_equipo, fec_reg, cod_almacen, tip_equipo, piso_ubic, serv_depar, nom_custodio) VALUES (?, ?, ?, ?, ?, ?, ?)';
                connection.query(query, [cod_equipo, fec_reg, cod_almacen, tip_equipo, piso_ubic, serv_depar, nom_custodio], (error, results, fields) => {
                    if (error) {
                        console.error('Error al insertar el equipo:', error);
                        res.status(500).json({ success: false, message: 'Error interno del servidor' });
                        return;
                    }
                    if (results.affectedRows === 1) {
                        res.status(200).json({ success: true, message: 'Equipo ingresado correctamente' });
                    } else {
                        res.status(500).json({ success: false, message: 'Error al insertar el equipo' });
                    }
                });
            });
        } catch (error) {
            console.error('Error al insertar el equipo:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    getNextCodEquipo: async (req, res) => {
        try {
            const { tableName } = req.params;
            const query = `SHOW TABLE STATUS LIKE '${tableName}'`;
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
                const nextCod = results[0].Auto_increment;
                res.json({ success: true, nextCod });
            } else {
                res.status(404).json({ success: false, message: `No se pudo obtener el próximo código de ${tableName}` });
            }
        } catch (error) {
            console.error(`Error al obtener el próximo código de ${tableName}:`, error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    obtenerUltimosCodAlmacen: async (req, res) => {
        try {
            const query = `
                SELECT cod_almacen 
                FROM equipo 
                WHERE cod_equipo IN (
                    SELECT MAX(cod_equipo) 
                    FROM equipo 
                    GROUP BY SUBSTRING_INDEX(SUBSTRING_INDEX(cod_almacen, '-', 2), '-', -1)
                )
            `;
            connection.query(query, (error, results, fields) => {
                if (error) {
                    console.error('Error al obtener los últimos registros de cod_almacen:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                if (results.length > 0) {
                    const ultimosCodAlmacen = results.map(row => row.cod_almacen);
                    res.status(200).json({ success: true, ultimosCodAlmacen });
                } else {
                    res.status(404).json({ success: false, message: 'No se encontraron registros en la tabla equipo' });
                }
            });
        } catch (error) {
            console.error('Error al obtener los últimos registros de cod_almacen:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarCPU: async (req, res) => {
        try {
            console.log('Datos recibidos CPU:', req.body);

            const {
                codCpu, codEq, codTicsCpu, marca, serie, tarjeta, procesador, velocidad, memoria, tamHdd,
                dispOpt, redFija, redInalam, bluethooth, lecTarjeta, sisOpe, office, antivirus, nomAnti,
                verAnti, host, usuario, ip, condicion, estado, observacion
            } = req.body;

            const query = `INSERT INTO cpu_equipo (cod_cpu, cod_equipo, cod_tics_cpu, mar_cpu, ser_cpu,
                                                    tar_madre, procesador, velocidad, memoria, tam_hdd,
                                                    disp_optico, red_fija, red_inalam, bluetooth, lec_tarjeta,
                                                    sis_ope, office, antivirus, nom_antivirus, ver_antivirus,
                                                    nom_hots, nom_usuario, ip_equipo, con_cpu, est_cpu, observacion) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                codCpu, codEq, codTicsCpu, marca, serie, tarjeta, procesador, velocidad, memoria, tamHdd,
                dispOpt, redFija, redInalam, bluethooth, lecTarjeta, sisOpe, office, antivirus, nomAnti,
                verAnti, host, usuario, ip, condicion, estado, observacion
            ];

            console.log('Query:', query);
            console.log('Values:', values);

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al guardar el CPU:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                res.status(200).json({ success: true, message: 'CPU guardado correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar el CPU:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarMTR: async (req, res) => {
        try {
            console.log('Datos recibidos MTR:', req.body);

            const { codMTR, codEq, codTics, marca, modelo, serie, tamano, condicion, estado, observacion } = req.body;

            const query = `INSERT INTO monitor (cod_monitor, cod_equipo, cod_tics_monitor, mar_monitor, mod_monitor, ser_monitor, 
                                                tam_monitor, con_monitor, est_monitor, observacion)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [codMTR, codEq, codTics, marca, modelo, serie, tamano, condicion, estado, observacion];

            console.log('Query:', query);
            console.log('Values:', values);

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al guardar el MTR:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                res.status(200).json({ success: true, message: 'MTR guardado correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar el MTR:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarTCL: async (req, res) => {
        try {
            console.log('Datos recibidos TCL:', req.body);

            const { codTCL, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, estado, observacion } = req.body;

            const query = `INSERT INTO teclado (cod_teclado, cod_equipo, cod_tics_teclado, mar_teclado, mod_teclado, ser_teclado, 
                                                tip_teclado, pue_teclado, con_teclado, est_teclado, obs_teclado)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

            const values = [codTCL, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, estado, observacion];

            console.log('Query:', query);
            console.log('Values:', values);

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al guardar el TCL:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                res.status(200).json({ success: true, message: 'TCL guardado correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar el TCL:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarMS: async (req, res) => {
        try {
            console.log('Datos recibidos MS:', req.body);

            const { codMS, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, estado, observacion } = req.body;

            const query = `INSERT INTO mouse (cod_mouse, cod_equipo, cod_tics_mouse, mar_mouse, mod_mouse, ser_mouse, tip_mouse, 
                                            pue_mouse, con_mouse, est_mouse, obs_mouse)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

            const values = [codMS, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, estado, observacion];

            console.log('Query:', query);
            console.log('Values:', values);

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al guardar el MS:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                res.status(200).json({ success: true, message: 'MS guardado correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar el MS:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarLaptop: async (req, res) => {
        try {
            console.log('Datos recibidos PTL:', req.body);

            const {
                codPTL, codEq, codTicsCpu, marca, modelo, serie, procesador, velocidad, memoria, tamHdd,
                dispOpt, redFija, redInalam, bluethooth, lecTarjeta, sisOpe, office, antivirus, nomAnti,
                verAnti, host, usuario, estado, observacion
            } = req.body;

            const query = `INSERT INTO laptop (cod_laptop, cod_equipo, cod_tics_laptop, mar_laptop, mod_laptop, 
                                                    ser_laptop, pro_laptop, vel_laptop, mem_laptop, hdd_laptop, 
                                                    dop_laptop, red_laptop, wif_laptop, blu_laptop, tar_laptop, 
                                                    so_laptop, off_laptop, antv_laptop, nom_antv_laptop, ver_antv_laptop, 
                                                    nom_hots_laptop, nom_usuario_laptop, est_laptop, observacion_laptop) 
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            const values = [
                codPTL, codEq, codTicsCpu, marca, modelo, serie, procesador, velocidad, memoria, tamHdd,
                dispOpt, redFija, redInalam, bluethooth, lecTarjeta, sisOpe, office, antivirus, nomAnti,
                verAnti, host, usuario, estado, observacion
            ];

            console.log('Query:', query);
            console.log('Values:', values);

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al guardar el PTL:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                res.status(200).json({ success: true, message: 'PTL guardado correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar el PTL:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarIMP: async (req, res) => {
        try {
            console.log('Datos recibidos IMP:', req.body);

            const { codIMP, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, ip, estado, observacion } = req.body;

            const query = `INSERT INTO impresora (cod_impresora, cod_equipo, cod_tics_impresora, mar_imp, mod_imp, ser_imp, tip_imp, 
                                                pue_imp, con_imp, ip_equipo_imp, est_imp, obs_imp)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

            const values = [codIMP, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, ip, estado, observacion];

            console.log('Query:', query);
            console.log('Values:', values);

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al guardar el IMP:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                res.status(200).json({ success: true, message: 'IMP guardado correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar el IMP:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    },

    guardarTLF: async (req, res) => {
        try {
            console.log('Datos recibidos TLF:', req.body);

            const { codTLF, codEq, codTics, marca, modelo, serie, condicion, estado, observacion } = req.body;

            const query = `INSERT INTO telefono (cod_telf, cod_equipo, cod_tics_telf, mar_telf, mod_telf, ser_telf, 
                                                con_telf, est_telf, obs_telf)
                            VALUES (?,?,?,?,?,?,?,?,?)`;

            const values = [codTLF, codEq, codTics, marca, modelo, serie, condicion, estado, observacion];

            console.log('Query:', query);
            console.log('Values:', values);

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error al guardar el TLF:', error);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }
                res.status(200).json({ success: true, message: 'TLF guardado correctamente' });
            });
        } catch (error) {
            console.error('Error al guardar el TLF:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
};

module.exports = equipoController;
