async function mostrarContenidoTabla(tipEquipo, mostrar, modalID) {
    const resultsElement = document.getElementById(mostrar);

    if (!resultsElement) {
        console.error(`Tabla with ID '${mostrar}' not encontrada`);
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/tics/equipos?tip_equipo=${tipEquipo}`);
        const data = await response.json();

        if (data.success && data.equipos.length > 0) {
            const equipos = data.equipos;
            const html = equipos.map(equipo => {
                const fecha = new Date(equipo.fec_reg).toISOString().split('T')[0]; // Obtener solo la parte de la fecha
                return `<tr>
                            <td>${equipo.cod_equipo}</td>
                            <td>${fecha}</td>
                            <td>${equipo.cod_almacen}</td>
                            <td>${equipo.tip_equipo}</td>
                            <td>${equipo.piso_ubic}</td>
                            <td>${equipo.serv_depar}</td>
                            <td>${equipo.nom_custodio}</td>
                            <td>${equipo.nom_usua}</td>
                            <td><button class="edit-btn" id="openModalBtn" 
                                    onclick="llenarCampos('${equipo.cod_equipo}', 
                                                            '${fecha}', 
                                                            '${equipo.cod_almacen}', 
                                                            '${equipo.tip_equipo}', 
                                                            '${equipo.piso_ubic}', 
                                                            '${equipo.serv_depar}', 
                                                            '${equipo.nom_custodio}', 
                                                            '${equipo.nom_usua}'), 
                                                mostrarVentanaEmergente('${modalID}')">Equipo</button>
                            </td>
                        </tr>`;
            }).join('');
            resultsElement.innerHTML = `<table>${html}</table>`;
        } else {
            resultsElement.innerHTML = '<p>No se encontraron equipos.</p>';
        }
    } catch (error) {
        resultsElement.innerHTML = '<p>Ocurrió un error al cargar el contenido de la tabla.</p>';
    }
}

async function getOptionsFrom(tabla, campo, selectId) {
    const select = document.getElementById(selectId);

    if (!select) {
        console.error(`Element with ID '${selectId}' not found`);
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/tics/options/${tabla}/${campo}`);
        const data = await response.json();

        if (data.success) {
            const options = data.options;
            const select = document.getElementById(selectId);

            if (!select) {
                console.error(`Element with ID '${selectId}' no encontrado`);
                return;
            }

            // Limpiar select antes de agregar nuevas opciones
            select.innerHTML = "";

            // Crear y agregar las opciones al select de manera eficiente
            const fragment = document.createDocumentFragment();
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.textContent = option;
                fragment.appendChild(optionElement);
            });
            select.appendChild(fragment);
        } else {
            console.error('Error al obtener opciones:', data.message);
        }
    } catch (error) {
        console.error('Error al obtener opciones:', error);
    }
}

function llenarCampos(codEquipo, fecha, codAlmacen, tipoEquipo, piso, departamento, titular, tecnico) {
    document.getElementById('cod').textContent = codEquipo;
    document.getElementById('fecha').textContent = fecha;
    document.getElementById('codAlmacen').value = codAlmacen;
    document.getElementById('tipoEquipo').value = tipoEquipo;
    document.getElementById('pisos').value = piso;
    document.getElementById('departamentos').value = departamento;
    document.getElementById('titularEq').value = titular;
    document.getElementById('tecnico').textContent = tecnico;
}

function guardarCambiosEq() {
    const codEquipo = document.getElementById('cod').textContent;
    const newCodAlmacen = document.getElementById('codAlmacen').value;
    const newTipoEquipo = document.getElementById('tipoEquipo').value;
    const newPiso = document.getElementById('pisos').value;
    const newDepartamento = document.getElementById('departamentos').value;
    const newTitular = document.getElementById('titularEq').value;

    // Mostrar ventana de confirmación al usuario
    const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?
        Código de Equipo: ${codEquipo}
        Código de Almacén: ${newCodAlmacen}
        Tipo de Equipo: ${newTipoEquipo}
        Piso: ${newPiso}
        Departamento: ${newDepartamento}
        Titular: ${newTitular}`
    );

    if (!confirmacion) {
        return; // Si el usuario cancela, no hacemos nada
    }

    fetch(`http://localhost:3000/tics/editEquipos/${codEquipo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            codEquipo: codEquipo,
            nuevoCodAlmacen: newCodAlmacen,
            nuevoTipoEquipo: newTipoEquipo,
            nuevoPiso: newPiso,
            nuevoDepartamento: newDepartamento,
            nuevoTitular: newTitular
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar cambios en el equipo');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            mostrarMensaje('Equipo Modificado Correctamente', 3000);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function enviarBodega() {
    const codEquipo = document.getElementById('cod').innerText;
    try {
        // Obtener información del equipo
        const equipoResponse = await fetch(`http://localhost:3000/tics/equipoB/${codEquipo}`);
        const equipoData = await equipoResponse.json();

        // Mostrar ventana de confirmación al usuario
        const confirmacion = confirm(`¿Estás seguro de enviar a bodega el siguiente equipo?
            Código: ${equipoData.equipo.cod_equipo}
            Ubicación Actual: ${equipoData.equipo.piso_ubic}
            Serv/Depar Actual: ${equipoData.equipo.serv_depar}
            Custodio Actual: ${equipoData.equipo.nom_custodio}

            El equipo será modificado a:
            Nueva Ubicación: SUBSUELO
            Serv/Depar Nuevo: BODEGA / ACTIVOS FIJOS
            Nuevo Custodio: LIBRE`
        );
        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        // Actualizar información del equipo
        const response = await fetch(`http://localhost:3000/tics/enviarBodega/${codEquipo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                piso_ubic: 'SUBSUELO',
                serv_depar: 'BODEGA / ACTIVOS FIJOS',
                nom_custodio: 'LIBRE'
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log('Equipo Guardado en Bodega Correctamente');
            mostrarMensaje('Equipo Guardado en Bodega Correctamente', 3000);
        } else {
            console.error('Error al editar equipo:', data.message);
        }
    } catch (error) {
        console.error('Error al editar equipo:', error);
    }
}

function marcarCheckBoxes(data, mapping) {
    Object.keys(mapping).forEach(key => {
        const checkbox = document.getElementById(mapping[key]);
        if (checkbox) {
            checkbox.checked = data[key] === 'SI';
        }
    });
}

//-------------------------------> PC DE ESCRITORIO
function actualizarCamposAntivirus() {
    const nuevoPoseeAntivirus = document.getElementById('poseeAntivirus').value;
    const antivirusCPU = document.getElementById('antivirus');
    const verAntivirus = document.getElementById('verAntivirus');

    if (nuevoPoseeAntivirus === 'NO') {
        antivirusCPU.value = ''; // Establecer en blanco
        verAntivirus.value = ''; // Establecer en blanco
    }
}

const escritorioMapping = {
    red_fija: 'redFija',
    red_inalam: 'redInalam',
    bluetooth: 'bluetooth',
    lec_tarjeta: 'lectorTarjeta'
};

function mostrarDatosCPU(cpu) {
    document.getElementById('nombreHost').value = cpu.nom_hots;
    document.getElementById('nomUsuario').value = cpu.nom_usuario;
    document.getElementById('generacion').value = cpu.ip_equipo;

    document.getElementById('poseeAntivirus').value = cpu.antivirus;
    document.getElementById('antivirus').value = cpu.nom_antivirus;
    document.getElementById('verAntivirus').value = cpu.ver_antivirus;
    actualizarCamposAntivirus();

    document.getElementById('tec').textContent = cpu.nom_usua;
    document.getElementById('codigo').textContent = cpu.cod_cpu;
    document.getElementById('codigoEq').value = cpu.cod_equipo;
    document.getElementById('codigotics').value = cpu.cod_tics_cpu;
    document.getElementById('marcas').value = cpu.mar_cpu;

    document.getElementById('numSerie').value = cpu.ser_cpu;
    document.getElementById('Mainboard').value = cpu.tar_madre;
    document.getElementById('procesador').value = cpu.procesador;
    document.getElementById('velocidadProce').value = cpu.velocidad;
    document.getElementById('ram').value = cpu.memoria;
    document.getElementById('hdd').value = cpu.tam_hdd;
    document.getElementById('disOpticos').value = cpu.disp_optico;

    document.getElementById('sisOperativo').value = cpu.sis_ope;
    document.getElementById('office').value = cpu.office;

    document.getElementById('condicion').value = cpu.con_cpu;
    document.getElementById('observacionTxt').value = cpu.observacion;

    marcarCheckBoxes(cpu, escritorioMapping);
}

function mostrarDatosMTR(mtr) {
    document.getElementById('codigoMTR').textContent = mtr.cod_monitor;
    document.getElementById('codigoticsMTR').value = mtr.cod_tics_monitor;
    document.getElementById('codigoEqMTR').value = mtr.cod_equipo;
    document.getElementById('tecMTR').textContent = mtr.nom_usua;
    document.getElementById('marcasMTR').value = mtr.mar_monitor;
    document.getElementById('modeloMTR').value = mtr.mod_monitor;
    document.getElementById('tamanoMTR').value = mtr.tam_monitor;
    document.getElementById('serieMTR').value = mtr.ser_monitor;
    document.getElementById('condicionMTR').value = mtr.con_monitor;
    document.getElementById('estadoMTR').value = mtr.est_monitor;
    document.getElementById('observacionTxtM').value = mtr.observacion;
}

function mostrarDatosTCD(tcd) {
    document.getElementById('codigoTCD').textContent = tcd.cod_teclado;
    document.getElementById('codigoticsTCD').value = tcd.cod_tics_teclado;
    document.getElementById('codigoEqTCD').value = tcd.cod_equipo;
    document.getElementById('tecTCD').textContent = tcd.nom_usua;
    document.getElementById('marcasTCD').value = tcd.mar_teclado;
    document.getElementById('puertoTCD').value = tcd.pue_teclado;
    document.getElementById('tipoTCD').value = tcd.tip_teclado;
    document.getElementById('serieTCD').value = tcd.ser_teclado;
    document.getElementById('modeloTCD').value = tcd.mod_teclado;
    document.getElementById('condicionTCD').value = tcd.con_teclado;
    document.getElementById('estadoTCD').value = tcd.est_teclado;
    document.getElementById('observacionTxtTCD').value = tcd.obs_teclado;
}

function mostrarDatosMS(ms) {
    document.getElementById('codigoMS').textContent = ms.cod_mouse;
    document.getElementById('codigoticsMS').value = ms.cod_tics_mouse;
    document.getElementById('codigoEqMS').value = ms.cod_equipo;
    document.getElementById('tecMS').textContent = ms.nom_usua;
    document.getElementById('marcasMS').value = ms.mar_mouse;
    document.getElementById('puertoMS').value = ms.puerto;
    document.getElementById('tipoMS').value = ms.tip_mouse;
    document.getElementById('serieMS').value = ms.ser_mouse;
    document.getElementById('modeloMS').value = ms.mod_mouse;
    document.getElementById('condicionMS').value = ms.con_mouse;
    document.getElementById('estadoMS').value = ms.est_mouse;
    document.getElementById('observacionTxtMS').value = ms.obs_mouse;
}

async function obtenerDatosTabla(tabla, codEquipo) {
    try {
        const response = await fetch(`http://localhost:3000/tics/datosTabla/${tabla}/${codEquipo}`);
        const data = await response.json();

        if (data.success) {
            const componente = data[tabla]; // Acceder correctamente a los datos del componente
            console.log("Datos de la tabla:", componente);
            // Verificar la tabla y llamar a la función correspondiente
            if (tabla === "cpu_equipo") {
                mostrarDatosCPU(componente);
            } else if (tabla === "monitor") {
                mostrarDatosMTR(componente);
            } else if (tabla === "mouse") {
                mostrarDatosMS(componente);
            } else if (tabla === "teclado") {
                mostrarDatosTCD(componente);
            } else if (tabla === "laptop") {
                mostrarDatosPLT(componente);
            } else if (tabla === "impresora") {
                mostrarDatosIMP(componente);
            } else if (tabla === "telefono") {
                mostrarDatosTLF(componente);
            } else {
                console.error("Tabla desconocida:", tabla);
            }
        } else {
            console.error('Error al obtener datos de la tabla:', data.message);
        }
    } catch (error) {
        console.error('Error al obtener datos de la tablaa:', error);
    }
}

async function guardarCambiosCPU() {
    try {
        const codCPU = document.getElementById('codigo').textContent;
        const codEquipo = document.getElementById('codigoEq').value;
        const codTicsCPU = document.getElementById('codigotics').value;
        const nuevaMarcaCPU = document.getElementById('marcas').value;
        const nuevoNumSerieCPU = document.getElementById('numSerie').value;
        const nuevoMainboard = document.getElementById('Mainboard').value;
        const nuevoProcesador = document.getElementById('procesador').value;
        const nuevaVelocidadProcesador = document.getElementById('velocidadProce').value;
        const nuevaRam = document.getElementById('ram').value;
        const nuevoHDD = document.getElementById('hdd').value;
        const nuevoDispositivoOptico = document.getElementById('disOpticos').value;

        // Verifica el estado de los checkboxs
        const redFija = document.getElementById('redFija').checked ? 'SI' : 'NO';
        const redInalambrica = document.getElementById('redInalam').checked ? 'SI' : 'NO';
        const bluetooth = document.getElementById('bluetooth').checked ? 'SI' : 'NO';
        const lectorTarjeta = document.getElementById('lectorTarjeta').checked ? 'SI' : 'NO';

        const nuevoSisOperativo = document.getElementById('sisOperativo').value;
        const nuevoOffice = document.getElementById('office').value;

        const nuevoPoseeAntivirus = document.getElementById('poseeAntivirus').value;
        let nuevoNomAntivirus = document.getElementById('antivirus').value;
        let nuevaVerAntivirus = document.getElementById('verAntivirus').value;

        // Verifica si nuevoPoseeAntivirus es "NO" y ajusta los campos correspondientes
        if (nuevoPoseeAntivirus === 'NO') {
            nuevoNomAntivirus = '';
            nuevaVerAntivirus = '';
        }

        const nuevoHost = document.getElementById('nombreHost').value;
        const nuevoUsuario = document.getElementById('nomUsuario').value;
        const nuevaGeneracion = document.getElementById('generacion').value;
        const nuevaCondicion = document.getElementById('condicion').value;
        const nuevoEstado = document.getElementById('estado').value;
        const nuevaObservacion = document.getElementById('observacionTxt').value;

        // Mostrar ventana de confirmación al usuario
        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?
\u2022 Cod CPU: ${codCPU}         \u2022 Cod Equipo: ${codEquipo}         \u2022 TICS: ${codTicsCPU}
\u2022 Titular: ${nuevoUsuario}     \u2022 Host: ${nuevoHost}
\u2022 Condicion: ${nuevaCondicion}     \u2022 Estado: ${nuevoEstado}\n
\u2022 Num Serie: ${nuevoNumSerieCPU}         
\u2022 Marca: ${nuevaMarcaCPU}
\u2022 Tar Madre: ${nuevoMainboard}         
\u2022 HDD: ${nuevoHDD}                     \u2022 RAM: ${nuevaRam}
\u2022 Procesador: ${nuevoProcesador}         \u2022 Velocidad: ${nuevaVelocidadProcesador}
\u2022 Sis Ope: ${nuevoSisOperativo}        \u2022 Office: ${nuevoOffice}\n
\u2022 Red Fija: ${redFija}         \u2022 Bluetoot: ${bluetooth}
\u2022 Red Inalam: ${redInalambrica}         \u2022 Lec. Tarjeta:${lectorTarjeta}
\u2022 Disp Opt: ${nuevoDispositivoOptico}\n
\u2022 Posee Antivirus: ${nuevoPoseeAntivirus}   \u2022 Nombre: ${nuevoNomAntivirus}   \u2022 Version: ${nuevaVerAntivirus}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        // Envía los datos al servidor
        const response = await fetch(`http://localhost:3000/tics/cpuModificado/${codEquipo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codCPU: codCPU,
                codEquipo: codEquipo,
                codTicsCPU: codTicsCPU,
                nuevaMarcaCPU: nuevaMarcaCPU,
                nuevoNumSerieCPU: nuevoNumSerieCPU,
                nuevoMainboard: nuevoMainboard,
                nuevoProcesador: nuevoProcesador,
                nuevaVelocidadProcesador: nuevaVelocidadProcesador,
                nuevaRam: nuevaRam,
                nuevoHDD: nuevoHDD,
                nuevoDispositivoOptico: nuevoDispositivoOptico,
                redFija: redFija,
                redInalambrica: redInalambrica,
                bluetooth: bluetooth,
                lectorTarjeta: lectorTarjeta,
                sistemaOperativo: nuevoSisOperativo,
                office: nuevoOffice,
                antivirus: nuevoPoseeAntivirus,
                nomAntivirus: nuevoNomAntivirus,
                verAntivirus: nuevaVerAntivirus,
                nomHost: nuevoHost,
                nomUsuario: nuevoUsuario,
                generacion: nuevaGeneracion,
                condicion: nuevaCondicion,
                estado: nuevoEstado,
                observacion: nuevaObservacion
            })
        });

        // Maneja la respuesta del servidor aquí
        const data = await response.json();
        if (data.success) {
            console.log('Cambios guardados correctamente');
        } else {
            console.error('Error al guardar los cambios:', data.message);
        }
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
    }
}

async function guardarCambiosMTR() {
    try {
        const codMTR = document.getElementById('codigoMTR').textContent;
        const codEquipo = document.getElementById('codigoEqMTR').value;
        const codTicsMTR = document.getElementById('codigoticsMTR').value;
        const nuevaMarcaMTR = document.getElementById('marcasMTR').value;
        const nuevoModeloMTR = document.getElementById('modeloMTR').value;
        const nuevoNumSerieMTR = document.getElementById('serieMTR').value;
        const nuevoTamMTR = document.getElementById('tamanoMTR').value;

        const nuevaConMTR = document.getElementById('condicionMTR').value;
        const nuevoEstMTR = document.getElementById('estadoMTR').value;
        const nuevaObservacionMTR = document.getElementById('observacionTxtM').value;

        // Mostrar ventana de confirmación al usuario
        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod MTR: ${codMTR}         \u2022 Cod Eq: ${codEquipo}          \u2022 TICS: ${codTicsMTR}
\u2022 Condicion: ${nuevaConMTR}     \u2022 Estado: ${nuevoEstMTR}\n
\u2022 Num Serie: ${nuevoNumSerieMTR}         \u2022 Modelo: ${nuevoModeloMTR} 
\u2022 Marca: ${nuevaMarcaMTR}         \u2022 Tamaño: ${nuevoTamMTR}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        // Envía los datos al servidor
        const response = await fetch(`http://localhost:3000/tics/mtrModificado/${codEquipo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codMTR: codMTR,
                codEquipo: codEquipo,
                codTicsMTR: codTicsMTR,
                nuevaMarcaMTR: nuevaMarcaMTR,
                nuevoModeloMTR: nuevoModeloMTR,
                nuevoNumSerieMTR: nuevoNumSerieMTR,
                nuevoTamMTR: nuevoTamMTR,
                nuevaConMTR: nuevaConMTR,
                nuevoEstMTR: nuevoEstMTR,
                nuevaObservacionMTR: nuevaObservacionMTR
            })
        });

        // Maneja la respuesta del servidor aquí
        const data = await response.json();
        if (data.success) {
            console.log('Cambios guardados correctamente');
            console.log('CONSULTA EJECUTA VER:', data);
        } else {
            console.error('Error al guardar los cambios MTR:', data.message);
            console.log('CONSULTA EJECUTA VER:', data);
        }
    } catch (error) {
        console.error('Error al guardar los cambios mtr:', error);
    }
}

async function guardarCambiosTCD() {
    try {
        const cod = document.getElementById('codigoTCD').textContent;
        const codEq = document.getElementById('codigoEqTCD').value;
        const codTics = document.getElementById('codigoticsTCD').value;
        const marca = document.getElementById('marcasTCD').value;
        const modelo = document.getElementById('modeloTCD').value;
        const serie = document.getElementById('serieTCD').value;
        const tipo = document.getElementById('tipoTCD').value;
        const puerto = document.getElementById('puertoTCD').value;

        const condicion = document.getElementById('condicionTCD').value;
        const estado = document.getElementById('estadoTCD').value;
        const observacion = document.getElementById('observacionTxtTCD').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod TCD: ${cod}         \u2022 Cod Eq: ${codEq}          \u2022 TICS: ${codTics}
\u2022 Condicion: ${condicion}     \u2022 Estado: ${estado}\n
\u2022 Num Serie: ${serie}
\u2022 Puerto: ${puerto}       \u2022 Modelo: ${modelo} 
\u2022 Marca: ${marca}         \u2022 Tipo: ${tipo}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        // Envía los datos al servidor
        const response = await fetch(`http://localhost:3000/tics/tcdModificado/${codEq}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codTCD: cod,
                codEquipo: codEq,
                codTicsTCD: codTics,
                nuevaMarcaTCD: marca,
                nuevoModeloTCD: modelo,
                nuevoNumSerieTCD: serie,
                nuevoTipoTCD: tipo,
                nuevoPuertoTCD: puerto,
                nuevaConTCD: condicion,
                nuevoEstTCD: estado,
                nuevaObservacionTCD: observacion
            })
        });

        // Maneja la respuesta del servidor aquí
        const data = await response.json();
        if (data.success) {
            console.log('Cambios guardados correctamente');
        } else {
            console.error('Error al guardar los cambios:', data.message);
        }
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
    }
}

async function guardarCambiosMS() {
    try {
        const cod = document.getElementById('codigoMS').textContent;
        const codEq = document.getElementById('codigoEqMS').value;
        const codTics = document.getElementById('codigoticsMS').value;
        const marca = document.getElementById('marcasMS').value;
        const modelo = document.getElementById('modeloMS').value;
        const serie = document.getElementById('serieMS').value;
        const tipo = document.getElementById('tipoMS').value;
        const puerto = document.getElementById('puertoMS').value;

        const condicion = document.getElementById('condicionMS').value;
        const estado = document.getElementById('estadoMS').value;
        const observacion = document.getElementById('observacionTxtMS').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod MS: ${cod}         \u2022 Cod Eq: ${codEq}          \u2022 TICS: ${codTics}
\u2022 Condicion: ${condicion}     \u2022 Estado: ${estado}\n
\u2022 Num Serie: ${serie}
\u2022 Puerto: ${puerto}       \u2022 Modelo: ${modelo} 
\u2022 Marca: ${marca}         \u2022 Tipo: ${tipo}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        // Envía los datos al servidor
        const response = await fetch(`http://localhost:3000/tics/msModificado/${codEq}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codMS: cod,
                codEquipo: codEq,
                codTicsMS: codTics,
                nuevaMarcaMS: marca,
                nuevoModeloMS: modelo,
                nuevoNumSerieMS: serie,
                nuevoTipoMS: tipo,
                nuevoPuertoMS: puerto,
                nuevaConMS: condicion,
                nuevoEstMS: estado,
                nuevaObservacionMS: observacion
            })
        });

        // Maneja la respuesta del servidor aquí
        const data = await response.json();
        if (data.success) {
            console.log('Cambios guardados correctamente');
        } else {
            console.error('Error al guardar los cambios:', data.message);
        }
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
    }
}

//-------------------------------> PORTATIL
const portatilMapping = {
    red_laptop: 'redFija',
    wif_laptop: 'redInalam',
    blu_laptop: 'bluetooth',
    tar_laptop: 'lectorTarjeta'
};

function mostrarDatosPLT(plt) {
    document.getElementById('nombreHost').value = plt.nom_hots_laptop;
    document.getElementById('nomUsuario').value = plt.nom_usuario_laptop;

    document.getElementById('poseeAntivirus').value = plt.antv_laptop;
    document.getElementById('antivirus').value = plt.nom_antv_laptop;
    document.getElementById('verAntivirus').value = plt.ver_antv_laptop;
    actualizarCamposAntivirus();

    document.getElementById('tec').textContent = plt.nom_usua;
    document.getElementById('codigo').textContent = plt.cod_laptop;
    document.getElementById('codigoEq').value = plt.cod_equipo;
    document.getElementById('codigotics').value = plt.cod_tics_laptop;
    document.getElementById('marcas').value = plt.mar_laptop;

    document.getElementById('numSerie').value = plt.ser_laptop;
    document.getElementById('modelo').value = plt.mod_laptop;
    document.getElementById('procesador').value = plt.pro_laptop;
    document.getElementById('velocidadProce').value = plt.vel_laptop;
    document.getElementById('ram').value = plt.mem_laptop;
    document.getElementById('hdd').value = plt.hdd_laptop;
    document.getElementById('disOpticos').value = plt.dop_laptop;

    document.getElementById('sisOperativo').value = plt.so_laptop;
    document.getElementById('office').value = plt.off_laptop;

    document.getElementById('estado').value = plt.est_laptop;
    document.getElementById('observacionTxt').value = plt.observacion_laptop;

    marcarCheckBoxes(plt, portatilMapping);
}

async function guardarCambiosPTL() {
    try {
        const cod = document.getElementById('codigo').textContent;
        const codEquipo = document.getElementById('codigoEq').value;
        const codTics = document.getElementById('codigotics').value;
        const nuevaMarca = document.getElementById('marcas').value;
        const nuevoNumSerie = document.getElementById('numSerie').value;
        const nuevoModelo = document.getElementById('modelo').value;
        const nuevoProcesador = document.getElementById('procesador').value;
        const nuevaVelocidad = document.getElementById('velocidadProce').value;
        const nuevaRam = document.getElementById('ram').value;
        const nuevoHDD = document.getElementById('hdd').value;
        const nuevoDispOptico = document.getElementById('disOpticos').value;

        // Verifica el estado de los checkboxs
        const redFija = document.getElementById('redFija').checked ? 'SI' : 'NO';
        const redInalambrica = document.getElementById('redInalam').checked ? 'SI' : 'NO';
        const bluethooth = document.getElementById('bluetooth').checked ? 'SI' : 'NO';
        const lectorTarjeta = document.getElementById('lectorTarjeta').checked ? 'SI' : 'NO';

        const nuevoSisOperativo = document.getElementById('sisOperativo').value;
        const nuevoOffice = document.getElementById('office').value;

        const nuevoPoseeAntivirus = document.getElementById('poseeAntivirus').value;
        let nuevoNomAntivirus = document.getElementById('antivirus').value;
        let nuevaVerAntivirus = document.getElementById('verAntivirus').value;

        const nuevoHost = document.getElementById('nombreHost').value;
        const nuevoUsuario = document.getElementById('nomUsuario').value;
        const nuevoEstado = document.getElementById('estado').value;
        const nuevaObservacion = document.getElementById('observacionTxt').value;

        // Verifica si nuevoPoseeAntivirus es "NO" y ajusta los campos correspondientes
        if (nuevoPoseeAntivirus === 'NO') {
            nuevoNomAntivirus = '';
            nuevaVerAntivirus = '';
        }

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod PTL: ${cod}         \u2022 Cod Eq: ${codEquipo}          \u2022 TICS: ${codTics}
\u2022 Titular: ${nuevoUsuario}     \u2022 Host: ${nuevoHost}     \u2022 Estado: ${nuevoEstado}\n
\u2022 Num Serie: ${nuevoNumSerie}                     \u2022 Modelo: ${nuevoModelo}
\u2022 Marca: ${nuevaMarca}
\u2022 HDD: ${nuevoHDD}                     \u2022 RAM: ${nuevaRam}
\u2022 Procesador: ${nuevoProcesador}         \u2022 Velocidad: ${nuevaVelocidad}
\u2022 Sis Ope: ${nuevoSisOperativo}        \u2022 Office: ${nuevoOffice}\n
\u2022 Red Fija: ${redFija}           \u2022 Bluetoot: ${bluethooth}
\u2022 Red Inalam: ${redInalambrica}         \u2022 Lec. Tarjeta:${lectorTarjeta}
\u2022 Disp Opt: ${nuevoDispOptico}\n
\u2022 Posee Antivirus: ${nuevoPoseeAntivirus}   \u2022 Nombre: ${nuevoNomAntivirus}   \u2022 Version: ${nuevaVerAntivirus}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        // Envía los datos al servidor
        const response = await fetch(`http://localhost:3000/tics/laptopModificada/${codEquipo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codPTL: cod, codEquipo: codEquipo, codTics: codTics, marca: nuevaMarca,
                modelo: nuevoModelo, serie: nuevoNumSerie, procesador: nuevoProcesador,
                velocidad: nuevaVelocidad, memoria: nuevaRam, hdd: nuevoHDD, dispOpt: nuevoDispOptico,
                red: redFija, wifi: redInalambrica, bluethooth: bluethooth, tarjeta: lectorTarjeta,
                sisOpe: nuevoSisOperativo, office: nuevoOffice, antivirus: nuevoPoseeAntivirus,
                nomAnt: nuevoNomAntivirus, verAnt: nuevaVerAntivirus, host: nuevoHost, usuario: nuevoUsuario,
                estado: nuevoEstado, observacion: nuevaObservacion
            })
        });

        // Maneja la respuesta del servidor aquí
        const data = await response.json();
        if (data.success) {
            console.log('Cambios guardados correctamente');
        } else {
            console.error('Error al guardar los cambios PTL:', data.message);
        }
    } catch (error) {
        console.error('Error al guardar los cambios PTL:', error);
    }
}

//-------------------------------> IMPRESORA
function mostrarDatosIMP(imp) {
    document.getElementById('tec').textContent = imp.nom_usua;
    document.getElementById('codigo').textContent = imp.cod_impresora;
    document.getElementById('codigoEq').value = imp.cod_equipo;
    document.getElementById('codigotics').value = imp.cod_tics_impresora;
    document.getElementById('marcas').value = imp.mar_imp;
    document.getElementById('numSerie').value = imp.ser_imp;
    document.getElementById('tipoIMP').value = imp.tip_imp;
    document.getElementById('puerto').value = imp.pue_imp;
    document.getElementById('modelo').value = imp.mod_imp;
    document.getElementById('estado').value = imp.est_imp;
    document.getElementById('condicion').value = imp.con_imp;
    document.getElementById('observacionTxt').value = imp.obs_imp;
}

async function guardarCambiosIMP() {
    try {
        const cod = document.getElementById('codigo').textContent;
        const codEquipo = document.getElementById('codigoEq').value;
        const codTics = document.getElementById('codigotics').value;
        const nuevoNumSerie = document.getElementById('numSerie').value;
        const nuevaCondi = document.getElementById('condicion').value;
        const nuevoEstado = document.getElementById('estado').value;
        const nuevoTipo = document.getElementById('tipoIMP').value;
        const nuevoModelo = document.getElementById('modelo').value;
        const nuevaMarca = document.getElementById('marcas').value;
        const nuevoPuerto = document.getElementById('puerto').value;

        const nuevaIP = document.getElementById('ip').value;
        const nuevaObservacion = document.getElementById('observacionTxt').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod IMP: ${cod}         \u2022 Cod Eq: ${codEquipo}          \u2022 TICS: ${codTics}
\u2022 Condicion: ${nuevaCondi}     \u2022 Estado: ${nuevoEstado}\n
\u2022 Num Serie: ${nuevoNumSerie}     \u2022 IP: ${nuevaIP}
\u2022 Puerto: ${nuevoPuerto}       \u2022 Modelo: ${nuevoModelo} 
\u2022 Marca: ${nuevaMarca}         \u2022 Tipo: ${nuevoTipo}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        // Envía los datos al servidor
        const response = await fetch(`http://localhost:3000/tics/impresoraModificada/${codEquipo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codIMP: cod, codEquipo: codEquipo, codTics: codTics, marca: nuevaMarca, modelo: nuevoModelo,
                serie: nuevoNumSerie, tipo: nuevoTipo, puerto: nuevoPuerto, condicion: nuevaCondi, ip: nuevaIP,
                estado: nuevoEstado, observacion: nuevaObservacion
            })
        });

        // Maneja la respuesta del servidor aquí
        const data = await response.json();
        if (data.success) {
            console.log('Cambios guardados correctamente');
        } else {
            console.error('Error al guardar los cambios IMP:', data.message);
        }
    } catch (error) {
        console.error('Error al guardar los cambios IMP:', error);
    }
}

//-------------------------------> TELEFONO
function mostrarDatosTLF(imp) {
    document.getElementById('tec').textContent = imp.nom_usua;
    document.getElementById('codigo').textContent = imp.cod_telf;
    document.getElementById('codigoEq').value = imp.cod_equipo;
    document.getElementById('codigotics').value = imp.cod_tics_telf;
    document.getElementById('marcas').value = imp.mar_telf;
    document.getElementById('numSerie').value = imp.ser_telf;
    document.getElementById('modelo').value = imp.mod_telf;
    document.getElementById('estado').value = imp.est_telf;
    document.getElementById('condicion').value = imp.con_telf;
    document.getElementById('observacionTxt').value = imp.obs_telf;
}

async function guardarCambiosTLF() {
    try {
        const cod = document.getElementById('codigo').textContent;
        const codEquipo = document.getElementById('codigoEq').value;
        const codTics = document.getElementById('codigotics').value;
        const nuevoNumSerie = document.getElementById('numSerie').value;
        const nuevaCondi = document.getElementById('condicion').value;
        const nuevoEstado = document.getElementById('estado').value;
        const nuevoModelo = document.getElementById('modelo').value;
        const nuevaMarca = document.getElementById('marcas').value;

        const nuevaObservacion = document.getElementById('observacionTxt').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod MS: ${cod}         \u2022 Cod Eq: ${codEquipo}          \u2022 TICS: ${codTics}
\u2022 Condicion: ${nuevaCondi}     \u2022 Estado: ${nuevoEstado}\n
\u2022 Num Serie: ${nuevoNumSerie}       \u2022 Modelo: ${nuevoModelo} 
\u2022 Marca: ${nuevaMarca}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        // Envía los datos al servidor
        const response = await fetch(`http://localhost:3000/tics/telefonoModificado/${codEquipo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codTLF: cod, codEquipo: codEquipo, codTics: codTics, marca: nuevaMarca, modelo: nuevoModelo,
                serie: nuevoNumSerie, condicion: nuevaCondi, estado: nuevoEstado, observacion: nuevaObservacion
            })
        });

        // Maneja la respuesta del servidor aquí
        const data = await response.json();
        if (data.success) {
            console.log('Cambios guardados correctamente');
        } else {
            console.error('Error al guardar los cambios TLF:', data.message);
        }
    } catch (error) {
        console.error('Error al guardar los cambios TLF:', error);
    }
}

//-------------------------------> BUSCAR
async function buscarEquipos(tipoEquipo, mostrar, modalID) {
    const query = document.getElementById('searchQuery').value;
    const resultsElement = document.getElementById(mostrar);

    if (!resultsElement) {
        console.error("Elemento 'results' no encontrado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/tics/buscarEquipos/${tipoEquipo}/${query}`);
        const data = await response.json();

        if (data.success && data.equipos.length > 0) {
            const equipos = data.equipos;
            const html = equipos.map(equipo => {
                const fecha = new Date(equipo.fec_reg).toISOString().split('T')[0]; // Obtener solo la parte de la fecha
                let buttonColumn = ''; // Inicializamos la columna de botones como vacía
                if (tipoEquipo !== 'todos') { // Verificamos si el tipo de equipo no es 'todos'
                    buttonColumn = `<td><button class="edit-btn" id="openModalBtn" 
                                    onclick="llenarCampos('${equipo.cod_equipo}', 
                                                            '${fecha}', 
                                                            '${equipo.cod_almacen}', 
                                                            '${equipo.tip_equipo}', 
                                                            '${equipo.piso_ubic}', 
                                                            '${equipo.serv_depar}', 
                                                            '${equipo.nom_custodio}', 
                                                            '${equipo.nom_usua}'), 
                                                        mostrarVentanaEmergente('${modalID}')">Equipo</button>
                                    </td>`;
                }
                return `<tr>
                            <td>${equipo.cod_equipo}</td>
                            <td>${fecha}</td>
                            <td>${equipo.cod_almacen}</td>
                            <td>${equipo.tip_equipo}</td>
                            <td>${equipo.piso_ubic}</td>
                            <td>${equipo.serv_depar}</td>
                            <td>${equipo.nom_custodio}</td>
                            <td>${equipo.nom_usua}</td>
                            ${buttonColumn} <!-- Insertamos la columna de botones aquí -->
                        </tr>`;
            }).join('');
            resultsElement.innerHTML = `<table>${html}</table>`;
        } else {
            resultsElement.innerHTML = '<p>No se encontraron equipos.</p>';
        }
    } catch (error) {
        resultsElement.innerHTML = '<p>Ocurrió un error al cargar el contenido de la tabla.</p>';
        console.error('Error al buscar equipos:', error);
    }
}


//-------------------------------> MOSTRAR PARA REPORTES
async function mostrarEquiposReporte(tbodyId) {
    const resultsElement = document.getElementById(tbodyId);
    if (!resultsElement) {
        console.error(`Tabla with ID '${tbodyId}' not encontrada`);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/tics/equiposR');
        const data = await response.json();

        if (data.success && data.equipos.length > 0) {
            const equipos = data.equipos;
            const html = equipos.map(equipo => {
                const fecha = new Date(equipo.fec_reg).toISOString().split('T')[0]; // Obtener solo la parte de la fecha
                return `<tr>
                            <td>${equipo.cod_equipo}</td>
                            <td>${fecha}</td>
                            <td>${equipo.cod_almacen}</td>
                            <td>${equipo.tip_equipo}</td>
                            <td>${equipo.piso_ubic}</td>
                            <td>${equipo.serv_depar}</td>
                            <td>${equipo.nom_custodio}</td>
                            <td>${equipo.nom_usua}</td>
                            </td>
                        </tr>`;
            }).join('');
            resultsElement.innerHTML = `<table>${html}</table>`;
        } else {
            console.error('No se pudieron obtener los equiposR.');
        }
    } catch (error) {
        console.error('Error al obtener equiposR:', error);
    }
}

//------------------------------->  INGRESO DE NUEVO EQUIPO
async function enviarDatosEquipo() {
    try {
        const cod_equipo = document.getElementById('newCod').textContent.trim();
        const fec_reg = document.getElementById('newFecha').textContent.trim();
        const cod_almacen = document.getElementById('newCodAlmacen').value.trim();
        const tip_equipo = document.getElementById('newTipoEquipo').value.trim();
        const piso_ubic = document.getElementById('pisos').value.trim();
        const serv_depar = document.getElementById('departamentos').value.trim();
        const nom_custodio = document.getElementById('newTitularEq').value.trim();
        // Verificar si hay campos vacíos cod_almacen === '' || 
        if (tip_equipo === '' || piso_ubic === '' || serv_depar === '' || nom_custodio === '') {
            console.error('Error: Debe completar todos los campos.');
            //alert('No se puede dejar campos Vacios en el Formulario NUEVO EQUIPO');
            mostrarMensaje('No se puede dejar campos Vacios en el Formulario NUEVO EQUIPO', 3500);
            return;
        }

        // Mostrar ventana de confirmación al usuario
        const confirmacion = confirm(`Se Creara un Nuevo Equipo. ¿Estás seguro de guardar el Equipo?\n
\u2022 Cod: ${cod_equipo}         \u2022 Fecha: ${fec_reg} 
\u2022 Cod Almacen: ${cod_almacen}        
\u2022 Tipo de Eq: ${tip_equipo}     \u2022 Piso: ${piso_ubic}
\u2022 Serv/Depar: ${serv_depar}         \u2022 Custodio: ${nom_custodio}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        const response = await fetch('http://localhost:3000/tics/ingresarEquipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cod_equipo,
                fec_reg,
                cod_almacen,
                tip_equipo,
                piso_ubic,
                serv_depar,
                nom_custodio
            })
        });
        const data = await response.json();
        if (data.success) {
            console.log('Equipo ingresado correctamenteJS');
            mostrarNewRegistro();
            //-------------------------------> Enviar a los demas Form Cod Alamcen
            setearCodAlmacenEnOtroFormulario(cod_almacen, 'codigotics');
            setearCodAlmacenEnOtroFormulario(cod_almacen, 'codigoticsPTL');
            setearCodAlmacenEnOtroFormulario(cod_almacen, 'codigoticsIMP');
            //-------------------------------> Enviar a los demas Form Nom Usuario
            setearCodAlmacenEnOtroFormulario(nom_custodio, 'nomUsuario');
            setearCodAlmacenEnOtroFormulario(nom_custodio, 'nomUsuarioPTL');
            //-------------------------------> Enviar a los demas Form cod Equipo
            setearCodAlmacenEnOtroFormulario(cod_equipo, 'codigoEq');
            setearCodAlmacenEnOtroFormulario(cod_equipo, 'newCodEqMTR');
            setearCodAlmacenEnOtroFormulario(cod_equipo, 'newCodEqTCD');
            setearCodAlmacenEnOtroFormulario(cod_equipo, 'codigoEqMS');
            setearCodAlmacenEnOtroFormulario(cod_equipo, 'codigoEqPTL');
            setearCodAlmacenEnOtroFormulario(cod_equipo, 'codigoEqIMP');
            setearCodAlmacenEnOtroFormulario(cod_equipo, 'codigoEqTLF');
        } else {
            console.error('Error al ingresar el equipoJS:', data.message);
            alert('ERROR al ingresar el Equipo (Dato ERRONEO o DUPLICADO)');
            //mostrarMensaje('ERROR al ingresar el Equipo (Dato ERRONEO o DUPLICADO)', 4000);
            window.location.reload()
        }
    } catch (error) {
        console.error('Error al enviar los datos del equipoJS:', error);
        alert('ERROR al enviar los datos Al Equipo');
        //mostrarMensaje('ERROR al enviar los datos Al Equipo', 4000);
    }
}

function setearCodAlmacenEnOtroFormulario(dato, campo) {
    const otroCampoCodAlmacen = document.getElementById(campo);
    if (otroCampoCodAlmacen) {
        otroCampoCodAlmacen.value = dato;
    }
}

async function mostrarProximoCodEquipo(tabla, campo) {
    try {
        const response = await fetch(`http://localhost:3000/tics/getNextCod/${tabla}/${campo}`);
        const data = await response.json();

        if (data.success) {
            const nextCod = data.nextCod;
            console.log(`Próximo código de ${tabla}: ${nextCod}`)
            document.getElementById(campo).textContent = nextCod;;
            // Aquí puedes realizar cualquier acción con el próximo código obtenido
        } else {
            console.error(`No se pudo obtener el próximo código de ${tabla}`);
        }
    } catch (error) {
        console.error(`Error al obtener el próximo código de ${tabla}:`, error);
    }
}

function setearFechaActual(fecha) {
    const spanFecha = document.getElementById(fecha);
    const fechaActual = new Date().toISOString().split('T')[0];
    spanFecha.textContent = fechaActual;
}

function mostrarNewRegistro() {
    const tipoEquipo = document.getElementById('newTipoEquipo').value;
    let modalID;

    switch (tipoEquipo) {
        case 'Escritorio':
            modalID = 'modal7';
            break;
        case 'Portátil':
            modalID = 'modal8';
            break;
        case 'Impresora':
            modalID = 'modal9';
            break;
        case 'Teléfono':
            modalID = 'modal10';
            break;
        default:
            console.error('Tipo de equipo no válido');
            return;
    }

    const modal = document.getElementById(modalID);
    modal.style.display = 'flex';
    // Cerrar con click afuera de la ventana
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            limpiezaArea();
        }
    });
}

function obtenerUltimosCodAlmacen() {
    try {
        fetch('http://localhost:3000/tics/obtenerUltimosCodAlmacen')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Últimos registros de cod_almacen:', data.ultimosCodAlmacen);
                    const textArea = document.getElementById('ultimosCodAlmacenArea');
                    textArea.value = data.ultimosCodAlmacen.join('\n');
                    // O si prefieres usar un span
                    // const span = document.getElementById('ultimosCodAlmacenSpan');
                    // span.textContent = data.ultimosCodAlmacen.join(', ');
                } else {
                    console.error('Error al obtener los últimos registros de cod_almacen:', data.message);
                }
            })
            .catch(error => {
                console.error('Error al enviar la solicitud:', error);
            });
    } catch (error) {
        console.error('Error al ejecutar la función obtenerUltimosCodAlmacen:', error);
    }
}

//------------------------------->  INGRESO DE NUEVO CPU
async function guardarCPU() {
    try {
        const codCpu = document.getElementById('codigo').textContent.trim();
        const codEq = document.getElementById('codigoEq').value.trim();
        const codTicsCpu = document.getElementById('codigotics').value.trim();
        const marca = document.getElementById('marcas').value;
        const serie = document.getElementById('numSerie').value.trim();
        const tarjeta = document.getElementById('Mainboard').value.trim();
        const procesador = document.getElementById('procesador').value;
        const velocidad = document.getElementById('velocidadProce').value.trim();
        const memoria = document.getElementById('ram').value;
        const tamHdd = document.getElementById('hdd').value;
        const dispOpt = document.getElementById('disOpticos').value;

        const redFija = document.getElementById('redFija').checked ? 'SI' : 'NO';
        const redInalam = document.getElementById('redInalam').checked ? 'SI' : 'NO';
        const bluethooth = document.getElementById('bluetooth').checked ? 'SI' : 'NO';
        const lecTarjeta = document.getElementById('lectorTarjeta').checked ? 'SI' : 'NO';

        const sisOpe = document.getElementById('sisOperativo').value;
        const office = document.getElementById('office').value;

        const antivirus = document.getElementById('poseeAntivirus').value;
        let nomAnti = document.getElementById('antivirus').value.trim();
        let verAnti = document.getElementById('verAntivirus').value.trim();

        if (antivirus === 'NO') {
            nomAnti = '';
            verAnti = '';
        }

        const host = document.getElementById('nombreHost').value.trim();
        const usuario = document.getElementById('nomUsuario').value.trim();
        const ip = document.getElementById('generacion').value.trim();
        const condicion = document.getElementById('condicion').value;
        const estado = document.getElementById('estado').value;
        const observacion = document.getElementById('observacionTxt').value;

        const confirmacion = confirm(`¿Estás seguro de guardar el nuevo CPU?\n
\u2022 Cod CPU: ${codCpu}         \u2022 Cod Equipo: ${codEq}         \u2022 TICS: ${codTicsCpu}
\u2022 Titular: ${usuario}     \u2022 Host: ${host}
\u2022 Condicion: ${condicion}     \u2022 Estado: ${estado}\n
\u2022 Num Serie: ${serie}         
\u2022 Marca: ${marca}
\u2022 Tar Madre: ${tarjeta}         
\u2022 HDD: ${tamHdd}                     \u2022 RAM: ${memoria}
\u2022 Procesador: ${procesador}         \u2022 Velocidad: ${velocidad}
\u2022 Generacion: ${ip}
\u2022 Sis Ope: ${sisOpe}        \u2022 Office: ${office}\n
\u2022 Red Fija: ${redFija}         \u2022 Bluetooth: ${bluethooth}
\u2022 Red Inalam: ${redInalam}         \u2022 Lec. Tarjeta:${lecTarjeta}
\u2022 Disp Opt: ${dispOpt}\n
\u2022 Posee Antivirus: ${antivirus}   \u2022 Nombre: ${nomAnti}   \u2022 Version: ${verAnti}`
        );

        if (!confirmacion) {
            return;
        }

        const response = await fetch('http://localhost:3000/tics/guardarCPU', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codCpu, codEq, codTicsCpu, marca, serie, tarjeta, procesador, velocidad, memoria, tamHdd,
                dispOpt, redFija, redInalam, bluethooth, lecTarjeta, sisOpe, office, antivirus, nomAnti,
                verAnti, host, usuario, ip, condicion, estado, observacion
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('CPU guardado correctamente');
            //mostrarMensaje('CPU guardado correctamente', 3000);
        } else {
            alert('Error al guardar el CPU: ' + result.message);
            //mostrarMensaje('Error al guardar el CPU: ' + result.message, 4000);
        }
    } catch (error) {
        console.error('Error al enviar los datos del CPU:', error);
        alert('Error al enviar los datos del CPU');
        //mostrarMensaje('Error al enviar los datos del CPU', 4000);
    }
}

//------------------------------->  INGRESO DE NUEVO MTR
async function guardarMTR() {
    try {
        const codMtr = document.getElementById('newCodMTR').textContent.trim();
        const codEq = document.getElementById('newCodEqMTR').value.trim();
        const codTics = document.getElementById('codigoticsMTR').value.trim();
        const marca = document.getElementById('marcasMTR').value;
        const modelo = document.getElementById('modeloMTR').value.trim();
        const serie = document.getElementById('serieMTR').value.trim();
        const tamano = document.getElementById('tamanoMTR').value.trim();
        const condicion = document.getElementById('condicionMTR').value;
        const estado = document.getElementById('estadoMTR').value;
        const observacion = document.getElementById('observacionTxtM').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
            \u2022 Cod MTR: ${codMtr}         \u2022 Cod Eq: ${codEq}          \u2022 TICS: ${codTics}
            \u2022 Condicion: ${condicion}     \u2022 Estado: ${estado}\n
            \u2022 Num Serie: ${serie}         \u2022 Modelo: ${modelo} 
            \u2022 Marca: ${marca}         \u2022 Tamaño: ${tamano}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        const response = await fetch('http://localhost:3000/tics/guardarMTR', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codMtr, codEq, codTics, marca, modelo, serie, tamano, condicion, estado, observacion
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('MTR guardado correctamente');
            //mostrarMensaje('MTR guardado correctamente', 3000);
        } else {
            alert('Error al guardar el MTR: ' + result.message);
            //mostrarMensaje('Error al guardar el MTR: '+ result.message, 4000);
        }
    } catch (error) {
        console.error('Error al guardar los cambios mtrs:', error);
    }
}

//------------------------------->  INGRESO DE NUEVO TCL
async function guardarTCL() {
    try {
        const codTCL = document.getElementById('codigoTCD').textContent.trim();
        const codEq = document.getElementById('newCodEqTCD').value.trim();
        const codTics = document.getElementById('codigoticsTCD').value;
        const marca = document.getElementById('marcasTCD').value;
        const modelo = document.getElementById('modeloTCD').value.trim();
        const serie = document.getElementById('serieTCD').value.trim();
        const tipo = document.getElementById('tipoTCD').value;
        const puerto = document.getElementById('puertoTCD').value;
        const condicion = document.getElementById('condicionTCD').value;
        const estado = document.getElementById('estadoTCD').value;
        const observacion = document.getElementById('observacionTxtTCD').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod TCD: ${codTCL}         \u2022 Cod Eq: ${codEq}          \u2022 TICS: ${codTics}
\u2022 Condicion: ${condicion}     \u2022 Estado: ${estado}\n
\u2022 Num Serie: ${serie}
\u2022 Puerto: ${puerto}       \u2022 Modelo: ${modelo} 
\u2022 Marca: ${marca}         \u2022 Tipo: ${tipo}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        const response = await fetch('http://localhost:3000/tics/guardarTCL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codTCL, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, estado, observacion
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('TCL guardado correctamente');
            //mostrarMensaje('TCL guardado correctamente', 3000);
        } else {
            alert('Error al guardar el TCL: ' + result.message);
            //mostrarMensaje('Error al guardar el TCL: ' + result.message, 4000);
        }
    } catch (error) {
        console.error('Error al guardar los cambios mtrs:', error);
    }
}

//------------------------------->  INGRESO DE NUEVO MS
async function guardarMS() {
    try {
        const codMs = document.getElementById('codigoMS').textContent.trim();
        const codEq = document.getElementById('codigoEqMS').value.trim();
        const codTics = document.getElementById('codigoticsMS').value;
        const marca = document.getElementById('marcasMS').value;
        const modelo = document.getElementById('modeloMS').value.trim();
        const serie = document.getElementById('serieMS').value.trim();
        const tipo = document.getElementById('tipoMS').value;
        const puerto = document.getElementById('puertoMS').value;
        const condicion = document.getElementById('condicionMS').value;
        const estado = document.getElementById('estadoMS').value;
        const observacion = document.getElementById('observacionTxtMS').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod MS: ${codMs}         \u2022 Cod Eq: ${codEq}          \u2022 TICS: ${codTics}
\u2022 Condicion: ${condicion}     \u2022 Estado: ${estado}\n
\u2022 Num Serie: ${serie}
\u2022 Puerto: ${puerto}       \u2022 Modelo: ${modelo} 
\u2022 Marca: ${marca}         \u2022 Tipo: ${tipo}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        const response = await fetch('http://localhost:3000/tics/guardarMS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codMs, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, estado, observacion
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('TCL guardado correctamente');
            cerrarVentanaEmergente('modal7')
            //mostrarMensaje('TCL guardado correctamente', 3000);
        } else {
            alert('Error al guardar el MSs: ' + result.message);
            //mostrarMensaje('Error al guardar el MSs: ' + result.message, 4000);
        }
    } catch (error) {
        console.error('Error al guardar los cambios MSs:', error);
    }
}

//------------------------------->  INGRESO DE NUEVA LALPTOP
async function guardarPTL() {
    try {
        const codPTL = document.getElementById('codigoPTL').textContent.trim();
        const codEq = document.getElementById('codigoEqPTL').value.trim();
        const codTicsCpu = document.getElementById('codigoticsPTL').value.trim();
        const marca = document.getElementById('marcasPTL').value;
        const modelo = document.getElementById('modeloPTL').value;
        const serie = document.getElementById('numSeriePTL').value.trim();
        const procesador = document.getElementById('procesadorPTL').value;
        const velocidad = document.getElementById('velocidadProcePTL').value.trim();
        const memoria = document.getElementById('ramPTL').value;
        const tamHdd = document.getElementById('hddPTL').value;
        const dispOpt = document.getElementById('disOpticosPTL').value;

        const redFija = document.getElementById('redFijaPTL').checked ? 'SI' : 'NO';
        const redInalam = document.getElementById('redInalamPTL').checked ? 'SI' : 'NO';
        const bluethooth = document.getElementById('bluetoothPTL').checked ? 'SI' : 'NO';
        const lecTarjeta = document.getElementById('lectorTarjetaPTL').checked ? 'SI' : 'NO';

        const sisOpe = document.getElementById('sisOperativoPTL').value;
        const office = document.getElementById('officePTL').value;

        const antivirus = document.getElementById('poseeAntivirusPTL').value;
        let nomAnti = document.getElementById('antivirusPTL').value.trim();
        let verAnti = document.getElementById('verAntivirusPTL').value.trim();

        if (antivirus === 'NO') {
            nomAnti = '';
            verAnti = '';
        }

        const host = document.getElementById('nombreHostPTL').value.trim();
        const usuario = document.getElementById('nomUsuarioPTL').value.trim();
        const estado = document.getElementById('estadoPTL').value;
        const observacion = document.getElementById('observacionTxtPTL').value;

        const confirmacion = confirm(`¿Estás seguro de guardar el nuevo CPU?\n
\u2022 Cod CPU: ${codPTL}         \u2022 Cod Equipo: ${codEq}         \u2022 TICS: ${codTicsCpu}
\u2022 Titular: ${usuario}     \u2022 Host: ${host}
\u2022 Estado: ${estado}\n
\u2022 Num Serie: ${serie}         
\u2022 Marca: ${marca}         \u2022 Modelo: ${modelo}         
\u2022 HDD: ${tamHdd}                     \u2022 RAM: ${memoria}
\u2022 Procesador: ${procesador}         \u2022 Velocidad: ${velocidad}
\u2022 Sis Ope: ${sisOpe}        \u2022 Office: ${office}\n
\u2022 Red Fija: ${redFija}         \u2022 Bluetooth: ${bluethooth}
\u2022 Red Inalam: ${redInalam}         \u2022 Lec. Tarjeta:${lecTarjeta}
\u2022 Disp Opt: ${dispOpt}\n
\u2022 Posee Antivirus: ${antivirus}   \u2022 Nombre: ${nomAnti}   \u2022 Version: ${verAnti}`
        );

        if (!confirmacion) {
            return;
        }

        const response = await fetch('http://localhost:3000/tics/guardarLaptop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codPTL, codEq, codTicsCpu, marca, modelo, serie, procesador, velocidad, memoria, tamHdd,
                dispOpt, redFija, redInalam, bluethooth, lecTarjeta, sisOpe, office, antivirus, nomAnti,
                verAnti, host, usuario, estado, observacion
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('LAPTOP guardado correctamente');
            //mostrarMensaje('CPU guardado correctamente', 3000);
        } else {
            alert('Error al guardar el LAPTOP: ' + result.message);
            //mostrarMensaje('Error al guardar el CPU: ' + result.message, 4000);
        }
    } catch (error) {
        console.error('Error al enviar los datos del LAPTOP:', error);
        alert('Error al enviar los datos del LAPTOP');
        //mostrarMensaje('Error al enviar los datos del CPU', 4000);
    }
}

//------------------------------->  INGRESO DE NUEVA IMP
async function guardarIMP() {
    try {
        const codIMP = document.getElementById('codigoIMP').textContent.trim();
        const codEq = document.getElementById('codigoEqIMP').value.trim();
        const codTics = document.getElementById('codigoticsIMP').value;
        const marca = document.getElementById('marcasIMP').value;
        const modelo = document.getElementById('modeloIMP').value.trim();
        const serie = document.getElementById('numSerieIMP').value.trim();
        const tipo = document.getElementById('tipoIMP').value;
        const puerto = document.getElementById('puertoIMP').value;
        const ip = document.getElementById('ipIMP').value;
        const condicion = document.getElementById('condicionIMP').value;
        const estado = document.getElementById('estadoIMP').value;
        const observacion = document.getElementById('observacionTxtIMP').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod MS: ${codIMP}         \u2022 Cod Eq: ${codEq}          \u2022 TICS: ${codTics}
\u2022 Condicion: ${condicion}     \u2022 Estado: ${estado}\n
\u2022 Num Serie: ${serie}     \u2022 IP: ${ip}
\u2022 Puerto: ${puerto}       \u2022 Modelo: ${modelo} 
\u2022 Marca: ${marca}         \u2022 Tipo: ${tipo}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        const response = await fetch('http://localhost:3000/tics/guardarIMP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codIMP, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, ip, estado, observacion
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('TCL guardado correctamente');
            cerrarVentanaEmergente('modal9')
            //mostrarMensaje('TCL guardado correctamente', 3000);
        } else {
            alert('Error al guardar el MSs: ' + result.message);
            //mostrarMensaje('Error al guardar el MSs: ' + result.message, 4000);
        }
    } catch (error) {
        console.error('Error al guardar los cambios MSs:', error);
    }
}

//------------------------------->  INGRESO DE NUEVA TLF
async function guardarTLF() {
    try {
        const codTLF = document.getElementById('codigoTLF').textContent.trim();
        const codEq = document.getElementById('codigoEqTLF').value.trim();
        const codTics = document.getElementById('codigoticsTLF').value;
        const marca = document.getElementById('marcasTLF').value;
        const modelo = document.getElementById('modeloTLF').value.trim();
        const serie = document.getElementById('numSerieTLF').value.trim();
        const condicion = document.getElementById('condicionTLF').value;
        const estado = document.getElementById('estadoTLF').value;
        const observacion = document.getElementById('observacionTxtTLF').value;

        const confirmacion = confirm(`¿Estás seguro de guardar los siguientes cambios?\n
\u2022 Cod MS: ${codTLF}         \u2022 Cod Eq: ${codEq}          \u2022 TICS: ${codTics}
\u2022 Condicion: ${condicion}     \u2022 Estado: ${estado}\n
\u2022 Num Serie: ${serie}       \u2022 Modelo: ${modelo}
\u2022 Marca: ${marca}`
        );

        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

        const response = await fetch('http://localhost:3000/tics/guardarTLF', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codTLF, codEq, codTics, marca, modelo, serie, condicion, estado, observacion
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('TLF guardado correctamente');
            cerrarVentanaEmergente('modal10')
            //mostrarMensaje('TCL guardado correctamente', 3000);
        } else {
            alert('Error al guardar el TLF: ' + result.message);
            //mostrarMensaje('Error al guardar el MSs: ' + result.message, 4000);
        }
    } catch (error) {
        console.error('Error al guardar los cambios TLF:', error);
    }
}

//-------------------------------> FUNCION PRINCIPAL
document.addEventListener('DOMContentLoaded', async () => {
    //-------------------------------> INGRESO DE NUEVO EQUIPO
    if (document.getElementById('newCodAlmacen')) {
        document.getElementById('newCodAlmacen').value = 'CZ9TICS-';
    }
    if (document.getElementById('codigoticsMTR')) {
        document.getElementById('codigoticsMTR').value = 'CZ9TICS-MON-';
    }
    if (document.getElementById('codigoticsTCD')) {
        document.getElementById('codigoticsTCD').value = 'CZ9TICS-TEC-';
    }
    if (document.getElementById('codigoticsMS')) {
        document.getElementById('codigoticsMS').value = 'CZ9TICS-MOU-';
    }
    if (document.getElementById('codigoticsTLF')) {
        document.getElementById('codigoticsTLF').value = 'CZ9TICS-TEL-';
    }
    if (document.getElementById('newFecha')) {
        setearFechaActual('newFecha');
    }
    if (document.getElementById('newCod')) {
        mostrarProximoCodEquipo('equipo', 'newCod');
    }
    if (document.getElementById('codigo')) {
        mostrarProximoCodEquipo('cpu_equipo', 'codigo');
    }
    if (document.getElementById('codigoMTR')) {
        mostrarProximoCodEquipo('monitor', 'codigoMTR');
    }
    if (document.getElementById('codigoTCD')) {
        mostrarProximoCodEquipo('teclado', 'codigoTCD');
    }
    if (document.getElementById('codigoMS')) {
        mostrarProximoCodEquipo('mouse', 'codigoMS');
    }
    if (document.getElementById('codigoPTL')) {
        mostrarProximoCodEquipo('laptop', 'codigoPTL');
    }
    if (document.getElementById('codigoIMP')) {
        mostrarProximoCodEquipo('impresora', 'codigoIMP');
    }
    if (document.getElementById('codigoTLF')) {
        mostrarProximoCodEquipo('telefono', 'codigoTLF');
    }
    obtenerUltimosCodAlmacen();
    //-------------------------------> Verificar y llamar a mostrarContenidoTabla solo si el elemento existe
    if (document.getElementById('results')) {
        mostrarContenidoTabla('Escritorio', 'results', 'modal1');
    }
    if (document.getElementById('resultsPortatil')) {
        mostrarContenidoTabla('Portatil', 'resultsPortatil', 'modal4');
    }
    if (document.getElementById('resultsImpresora')) {
        mostrarContenidoTabla('Impresora', 'resultsImpresora', 'modal5');
    }
    if (document.getElementById('resultsTelefono')) {
        mostrarContenidoTabla('Teléfono', 'resultsTelefono', 'modal6');
    }
    if (document.getElementById('resultsReporte')) {
        mostrarEquiposReporte('resultsReporte');
    }
    //-------------------------------> Verificar y llamar a getOptionsFrom solo si el elemento existe
    const optionMappings = [
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionMTR' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionTCD' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionMS' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicion' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionIMP' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionTLF' },

        { table: 'param_sis_ope', field: 'nom_sis_ope', id: 'sisOperativo' },
        { table: 'param_sis_ope', field: 'nom_sis_ope', id: 'sisOperativoPTL' },

        { table: 'param_procesador', field: 'nom_proce', id: 'procesador' },
        { table: 'param_procesador', field: 'nom_proce', id: 'procesadorPTL' },

        { table: 'param_dis_opt', field: 'nom_dis_opt', id: 'disOpticos' },
        { table: 'param_dis_opt', field: 'nom_dis_opt', id: 'disOpticosPTL' },

        { table: 'param_tamano_hdd', field: 'nom_tam_hdd', id: 'hdd' },
        { table: 'param_tamano_hdd', field: 'nom_tam_hdd', id: 'hddPTL' },

        { table: 'param_office', field: 'nom_office', id: 'office' },
        { table: 'param_office', field: 'nom_office', id: 'officePTL' },

        { table: 'param_memoria', field: 'nom_memoria', id: 'ram' },
        { table: 'param_memoria', field: 'nom_memoria', id: 'ramPTL' },

        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasMTR' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasTCD' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasMS' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcas' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasPTL' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasIMP' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasTLF' },

        { table: 'param_estado', field: 'nom_estado', id: 'estadoMTR' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoTCD' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoMS' },
        { table: 'param_estado', field: 'nom_estado', id: 'estado' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoPTL' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoIMP' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoTLF' },

        { table: 'param_puertos', field: 'nom_puerto', id: 'puertoTCD' },
        { table: 'param_puertos', field: 'nom_puerto', id: 'puertoMS' },
        { table: 'param_puertos', field: 'nom_puerto', id: 'puerto' },
        { table: 'param_puertos', field: 'nom_puerto', id: 'puertoIMP' },

        { table: 'param_tipo_mt', field: 'nom_tmt', id: 'tipoTCD' },
        { table: 'param_tipo_mt', field: 'nom_tmt', id: 'tipoMS' },

        { table: 'param_tamano_monitor', field: 'nom_tam_mon', id: 'tamanoMTR' },
        { table: 'param_servicio', field: 'nom_servicio', id: 'departamentos' },
        // { table: 'param_servicio', field: 'nom_servicio', id: 'newDepartamentos' },

        { table: 'param_antivirus', field: 'nom_antivirus', id: 'antivirus' },
        { table: 'param_antivirus', field: 'nom_antivirus', id: 'antivirusPTL' },

        { table: 'param_tipo_impresora', field: 'nom_ti', id: 'tipoIMP' },

        { table: 'param_tipo_equipo', field: 'nom_te', id: 'tipoEquipo' },
        { table: 'param_tipo_equipo', field: 'nom_te', id: 'newTipoEquipo' },

        { table: 'param_piso', field: 'nom_piso', id: 'pisos' }
        // { table: 'param_piso', field: 'nom_piso', id: 'newPisos' }
    ];

    optionMappings.forEach(mapping => {
        if (document.getElementById(mapping.id)) {
            getOptionsFrom(mapping.table, mapping.field, mapping.id);
        }
    });
});
