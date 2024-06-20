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
        window.location.reload();
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
        // Cerrar la ventana emergente si el usuario cancela
        window.location.reload();
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
            cerrarVentanaEmergente(modalId); // Cerrar la ventana emergente después de guardar los cambios
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
    lec_tarjeta: 'lectorTarjeta',
    red_fija: 'redFijaEntrega',
    red_inalam: 'redInalamEntrega',
    bluetooth: 'bluetoothEntrega',
    lec_tarjeta: 'lectorTarjetaEntrega'
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

    document.getElementById('estado').value = cpu.est_cpu;
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
            window.location.reload();
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
            window.location.reload();
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
            window.location.reload();
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
            window.location.reload();
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
            window.location.reload();
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
            window.location.reload();
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
            window.location.reload();
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

//------------------------------->  INGRESO DE NUEVO EQUIPO
async function enviarDatosEquipo() {
    try {
        const cod_equipo = document.getElementById('newCod').textContent.trim();
        const fec_reg = document.getElementById('newFecha').textContent.trim();
        const tec = document.getElementById('newTecnico').textContent.trim();
        const cod_almacen = document.getElementById('newCodAlmacen').value.trim();
        const tip_equipo = document.getElementById('newTipoEquipo').value.trim();
        const piso_ubic = document.getElementById('pisos').value.trim();
        const serv_depar = document.getElementById('departamentos').value.trim();
        const nom_custodio = document.getElementById('newTitularEq').value.trim();
        // Verificar si hay campos vacíos cod_almacen === '' || 
        if (tip_equipo === '' || piso_ubic === '' || serv_depar === '' || nom_custodio === '' || tec === '') {
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
            window.location.reload();
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
                nom_custodio,
                tec
            })
        });
        const data = await response.json();
        if (data.success) {
            alert('Equipo ingresado correctamente');
            //mostrarVentanaEmergente('modal7');
            mostrarNewRegistro();
            //-------------------------------> Enviar a los demas Form Cod Alamcen
            setearDatoEnElemento(cod_almacen, 'codigotics', 'input');
            setearDatoEnElemento(cod_almacen, 'codigoticsPTL', 'input');
            setearDatoEnElemento(cod_almacen, 'codigoticsIMP', 'input');
            //-------------------------------> Enviar a los demas Form Nom Usuario
            setearDatoEnElemento(nom_custodio, 'nomUsuario', 'input');
            setearDatoEnElemento(nom_custodio, 'nomUsuarioPTL', 'input');
            //-------------------------------> Enviar a los demas Form cod Equipo
            setearDatoEnElemento(cod_equipo, 'codigoEq', 'input');
            setearDatoEnElemento(cod_equipo, 'newCodEqMTR', 'input');
            setearDatoEnElemento(cod_equipo, 'newCodEqTCD', 'input');
            setearDatoEnElemento(cod_equipo, 'codigoEqMS', 'input');
            setearDatoEnElemento(cod_equipo, 'codigoEqPTL', 'input');
            setearDatoEnElemento(cod_equipo, 'codigoEqIMP', 'input');
            setearDatoEnElemento(cod_equipo, 'codigoEqTLF', 'input');
            //-------------------------------> Enviar a los demas Form nom Tec
            setearDatoEnElemento(tec, 'tecCPU', 'span');
            setearDatoEnElemento(tec, 'tecMTR', 'span');
            setearDatoEnElemento(tec, 'tecTCD', 'span');
            setearDatoEnElemento(tec, 'tecMS', 'span');
            setearDatoEnElemento(tec, 'tecPTL', 'span');
            setearDatoEnElemento(tec, 'tecIMP', 'span');
            setearDatoEnElemento(tec, 'tecTLF', 'span');
        } else {
            console.error('Error al ingresar el equipoJS:', data.message);
            alert('ERROR al ingresar el Equipo (Dato ERRONEO o DUPLICADO)');
            //mostrarMensaje('ERROR al ingresar el Equipo (Dato ERRONEO o DUPLICADO)', 4000);
            window.location.reload();
        }
    } catch (error) {
        console.error('Error al enviar los datos del equipoJS:', error);
        alert('ERROR al enviar los datos Al Equipo');
        //mostrarMensaje('ERROR al enviar los datos Al Equipo', 4000);
    }
}

function setearDatoEnElemento(dato, campo, tipoElemento) {
    const elemento = document.getElementById(campo);
    if (elemento) {
        if (tipoElemento === 'input') {
            elemento.value = dato;
        } else if (tipoElemento === 'span') {
            elemento.textContent = dato;
        } else {
            console.error('Tipo de elemento no válido.');
        }
    } else {
        console.error('Elemento no encontrado.');
    }
}

async function mostrarProximoCodEquipo(tabla, campo) {
    try {
        const response = await fetch(`http://localhost:3000/tics/getNextCod/${tabla}/${campo}`);
        const data = await response.json();

        if (data.success) {
            const nextCod = data.nextCod;
            console.log(`Próximo código de ${tabla}: ${nextCod}`)
            document.getElementById(campo).textContent = nextCod;
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
            alert('Tipo de equipo no válido');
            return;
    }
    const modal = document.getElementById(modalID);
    modal.style.display = 'flex';
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
        const tec = document.getElementById('tecCPU').textContent.trim();
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
            window.location.reload();
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
                verAnti, host, usuario, ip, condicion, estado, observacion, tec
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
        const tec = document.getElementById('tecMTR').textContent.trim();
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
                codMtr, codEq, codTics, marca, modelo, serie, tamano, condicion, estado, observacion, tec
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
        const tec = document.getElementById('tecTCD').textContent.trim();
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
                codTCL, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, estado, observacion, tec
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
        const tec = document.getElementById('tecMS').textContent.trim();
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
                codMs, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, estado, observacion, tec
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
        const tec = document.getElementById('tecPTL').textContent.trim();
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
                verAnti, host, usuario, estado, observacion, tec
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
        const tec = document.getElementById('tecCPU').textContent.trim();
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
                codIMP, codEq, codTics, marca, modelo, serie, tipo, puerto, condicion, ip, estado, observacion, tec
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
        const tec = document.getElementById('tecCPU').textContent.trim();
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
                codTLF, codEq, codTics, marca, modelo, serie, condicion, estado, observacion, tec
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

//-------------------------------> FILTADRADO
function filtrarEquipos() {
    // Obtener el estado de los checkboxes
    const mostrarFecha = document.getElementById('checkFecha').checked;
    const mostrarPisos = document.getElementById('checkPisos').checked;
    const mostrarDepartamentos = document.getElementById('checkDepartamentos').checked;
    const mostrarCustodio = document.getElementById('checkCustodio').checked;
    const mostrarTecnico = document.getElementById('checkTecnico').checked;

    // Verificar si no hay ningún checkbox seleccionado
    if (!mostrarFecha && !mostrarPisos && !mostrarDepartamentos && !mostrarCustodio && !mostrarTecnico) {
        location.reload(); // Recargar la página
        return;
    }

    // Obtener la tabla y los equipos
    const table = document.querySelector('.equipos');
    const equipos = table.querySelectorAll('tr:not(:first-child) ');

    // Crear un objeto para agrupar los equipos
    const equiposAgrupados = {};

    // Iterar sobre los equipos y agruparlos según los checkboxes seleccionados
    equipos.forEach(equipo => {
        let claveGrupo = '';

        // Construir la clave de grupo basada en los checkboxes seleccionados
        if (mostrarFecha) {
            const fechaCell = equipo.querySelector('td:nth-child(2)');
            if (fechaCell && fechaCell.textContent.trim() !== '') {
                claveGrupo += fechaCell.textContent;
            }
        }
        if (mostrarPisos) {
            const pisoCell = equipo.querySelector('td:nth-child(5)');
            if (pisoCell && pisoCell.textContent.trim() !== '') {
                claveGrupo += mostrarFecha ? ` - ${pisoCell.textContent}` : `${pisoCell.textContent}`;
            }
        }
        if (mostrarDepartamentos) {
            const departamentoCell = equipo.querySelector('td:nth-child(6)');
            if (departamentoCell && departamentoCell.textContent.trim() !== '') {
                claveGrupo += mostrarFecha || mostrarPisos ? ` - ${departamentoCell.textContent}` : `${departamentoCell.textContent}`;
            }
        }
        if (mostrarCustodio) {
            const custodioCell = equipo.querySelector('td:nth-child(7)');
            if (custodioCell && custodioCell.textContent.trim() !== '') {
                claveGrupo += mostrarFecha || mostrarPisos || mostrarDepartamentos ? ` - ${custodioCell.textContent}` : `${custodioCell.textContent}`;
            }
        }
        if (mostrarTecnico) {
            const tecnicoCell = equipo.querySelector('td:nth-child(8)');
            if (tecnicoCell && tecnicoCell.textContent.trim() !== '') {
                claveGrupo += mostrarFecha || mostrarPisos || mostrarDepartamentos || mostrarCustodio ? ` - ${tecnicoCell.textContent}` : `${tecnicoCell.textContent}`;
            }
        }

        // Agregar el equipo al grupo correspondiente si hay contenido en la clave del grupo
        if (claveGrupo !== '') {
            if (!equiposAgrupados[claveGrupo]) {
                equiposAgrupados[claveGrupo] = [];
            }
            equiposAgrupados[claveGrupo].push(equipo.outerHTML);
        }
    });

    // Generar el HTML para mostrar los equipos agrupados en la tabla
    let html = '';
    for (const key in equiposAgrupados) {
        html += `<tr style="background-color: #38a5d8;"><td colspan="9">${key}</td></tr>`; // Encabezado del grupo
        equiposAgrupados[key].forEach(equipo => {
            html += equipo; // Agregar cada equipo del grupo
        });
    }

    // Actualizar el contenido de la tabla
    table.innerHTML = `<table>${html}</table>`;
}

function filtrarEquiposCPU() {
    const mostrarMarca = document.getElementById('checkMarcaCPU').checked;
    const mostrarTarjetaMadre = document.getElementById('checkTarjetaMadreCPU').checked;
    const mostrarProcesador = document.getElementById('checkProcesadorCPU').checked;
    const mostrarVelocidad = document.getElementById('checkVelocidadCPU').checked;
    const mostrarMemoria = document.getElementById('checkMemoriaCPU').checked;
    const mostrarAlmacenamiento = document.getElementById('checkAlamcenamientoCPU').checked;
    const mostrarDispositivosOpticos = document.getElementById('checkDispositivosOpticosCPU').checked;
    const mostrarRedFija = document.getElementById('checkRedFijaCPU').checked;
    // const mostrarRedInalambrica = document.getElementById('checkRedInalambricaCPU').checked;
    // const mostrarBluetooth = document.getElementById('checkBluetoothCPU').checked;
    const mostrarLectorTarjeta = document.getElementById('checkLectorTarjetaCPU').checked;
    const mostrarSisOpe = document.getElementById('checkSisOpeCPU').checked;
    const mostrarOffice = document.getElementById('checkOfficeCPU').checked;
    const mostrarIpEquipo = document.getElementById('checkUsuaIpEquipoCPU').checked;
    const mostrarTecnico = document.getElementById('checkTecnicoCPU').checked;

    // && !mostrarRedInalambrica && !mostrarBluetoot
    if (!mostrarMarca && !mostrarTarjetaMadre && !mostrarProcesador && !mostrarVelocidad &&
        !mostrarMemoria && !mostrarAlmacenamiento && !mostrarDispositivosOpticos && !mostrarRedFija
        && !mostrarLectorTarjeta && !mostrarSisOpe &&
        !mostrarOffice && !mostrarIpEquipo && !mostrarTecnico) {
        location.reload(); // Recargar la página
        return;
    }

    const table = document.querySelector('.equiposE tbody');
    const equipos = table.querySelectorAll('tr');

    const equiposAgrupados = {};

    equipos.forEach(equipo => {
        let claveGrupo = '';

        if (mostrarMarca) {
            const marcaCell = equipo.querySelector('td:nth-child(4)');
            if (marcaCell && marcaCell.textContent.trim() !== '') {
                claveGrupo += marcaCell.textContent;
            }
        }

        if (mostrarTarjetaMadre) {
            const tarjetaMadreCell = equipo.querySelector('td:nth-child(6)');
            if (tarjetaMadreCell && tarjetaMadreCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca ? ` - ${tarjetaMadreCell.textContent}` : `${tarjetaMadreCell.textContent}`;
            }
        }

        if (mostrarProcesador) {
            const procesadorCell = equipo.querySelector('td:nth-child(7)');
            if (procesadorCell && procesadorCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre ? ` - ${procesadorCell.textContent}` : `${procesadorCell.textContent}`;
            }
        }

        if (mostrarVelocidad) {
            const velocidadCell = equipo.querySelector('td:nth-child(8)');
            if (velocidadCell && velocidadCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador ? ` - ${velocidadCell.textContent}` : `${velocidadCell.textContent}`;
            }
        }

        if (mostrarMemoria) {
            const memoriaCell = equipo.querySelector('td:nth-child(9)');
            if (memoriaCell && memoriaCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad ? ` - ${memoriaCell.textContent}` : `${memoriaCell.textContent}`;
            }
        }

        if (mostrarAlmacenamiento) {
            const almacenamientoCell = equipo.querySelector('td:nth-child(10)');
            if (almacenamientoCell && almacenamientoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria ? ` - ${almacenamientoCell.textContent}` : `${almacenamientoCell.textContent}`;
            }
        }

        if (mostrarDispositivosOpticos) {
            const dispositivosOpticosCell = equipo.querySelector('td:nth-child(11)');
            if (dispositivosOpticosCell && dispositivosOpticosCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento ? ` - ${dispositivosOpticosCell.textContent}` : `${dispositivosOpticosCell.textContent}`;
            }
        }

        if (mostrarRedFija) {
            const redFijaCell = equipo.querySelector('td:nth-child(12)');
            if (redFijaCell && redFijaCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento || mostrarDispositivosOpticos ? ` - ${redFijaCell.textContent}` : `${redFijaCell.textContent}`;
            }
        }

        // if (mostrarRedInalambrica) {
        //     const redInalambricaCell = equipo.querySelector('td:nth-child(13)');
        //     if (redInalambricaCell && redInalambricaCell.textContent.trim() !== '') {
        //         claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento || mostrarDispositivosOpticos || mostrarRedFija ? ` - ${redInalambricaCell.textContent}` : `${redInalambricaCell.textContent}`;
        //     }
        // }

        // if (mostrarBluetooth) {
        //     const bluetoothCell = equipo.querySelector('td:nth-child(14)');
        //     if (bluetoothCell && bluetoothCell.textContent.trim() !== '') {
        //         claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento || mostrarDispositivosOpticos || mostrarRedFija || mostrarRedInalambrica ? ` - ${bluetoothCell.textContent}` : `${bluetoothCell.textContent}`;
        //     }
        // }

        if (mostrarLectorTarjeta) {
            const lectorTarjetaCell = equipo.querySelector('td:nth-child(15)');
            if (lectorTarjetaCell && lectorTarjetaCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento || mostrarDispositivosOpticos || mostrarRedFija || mostrarRedInalambrica || mostrarBluetooth ? ` - ${lectorTarjetaCell.textContent}` : `${lectorTarjetaCell.textContent}`;
            }
        }

        if (mostrarSisOpe) {
            const sisOpeCell = equipo.querySelector('td:nth-child(16)');
            if (sisOpeCell && sisOpeCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento || mostrarDispositivosOpticos || mostrarRedFija || mostrarRedInalambrica || mostrarBluetooth || mostrarLectorTarjeta ? ` - ${sisOpeCell.textContent}` : `${sisOpeCell.textContent}`;
            }
        }

        if (mostrarOffice) {
            const officeCell = equipo.querySelector('td:nth-child(17)');
            if (officeCell && officeCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento || mostrarDispositivosOpticos || mostrarRedFija || mostrarRedInalambrica || mostrarBluetooth || mostrarLectorTarjeta || mostrarSisOpe ? ` - ${officeCell.textContent}` : `${officeCell.textContent}`;
            }
        }

        if (mostrarIpEquipo) {
            const ipEquipoCell = equipo.querySelector('td:nth-child(23)');
            if (ipEquipoCell && ipEquipoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento || mostrarDispositivosOpticos || mostrarRedFija || mostrarRedInalambrica || mostrarBluetooth || mostrarLectorTarjeta || mostrarSisOpe || mostrarOffice ? ` - ${ipEquipoCell.textContent}` : `${ipEquipoCell.textContent}`;
            }
        }

        if (mostrarTecnico) {
            const tecnicoCell = equipo.querySelector('td:nth-child(27)');
            if (tecnicoCell && tecnicoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarTarjetaMadre || mostrarProcesador || mostrarVelocidad || mostrarMemoria || mostrarAlmacenamiento || mostrarDispositivosOpticos || mostrarRedFija || mostrarRedInalambrica || mostrarBluetooth || mostrarLectorTarjeta || mostrarSisOpe || mostrarOffice || mostrarIpEquipo ? ` - ${tecnicoCell.textContent}` : `${tecnicoCell.textContent}`;
            }
        }

        if (claveGrupo !== '') {
            if (!equiposAgrupados[claveGrupo]) {
                equiposAgrupados[claveGrupo] = [];
            }
            equiposAgrupados[claveGrupo].push(equipo.outerHTML);
        }
    });

    let html = '';
    for (const key in equiposAgrupados) {
        html += `<tr style="background-color: #38a5d8;"><td colspan="27">${key}</td></tr>`;
        equiposAgrupados[key].forEach(equipo => {
            html += equipo;
        });
    }

    table.innerHTML = html;
}

function filtrarEquiposPTL() {
    // Obtener el estado de los checkboxes
    const mostrarMarca = document.getElementById('checkMarcaPLT').checked;
    const mostrarModelo = document.getElementById('checkModeloPLT').checked;
    const mostrarProcesador = document.getElementById('checkProcesadorPLT').checked;
    const mostrarMemoria = document.getElementById('checkMemoriaPLT').checked;
    const mostrarAlmacenamiento = document.getElementById('checkAlamcenamientoPLT').checked;
    const mostrarSisOpe = document.getElementById('checkSisOpePLT').checked;
    const mostrarOffice = document.getElementById('checkOfficePLT').checked;
    const mostrarUsuario = document.getElementById('checkUsuarioPLT').checked;
    const mostrarTecnico = document.getElementById('checkTecnicoPLT').checked;

    // Verificar si no hay ningún checkbox seleccionado
    if (!mostrarMarca && !mostrarModelo && !mostrarProcesador && !mostrarMemoria && !mostrarAlmacenamiento && !mostrarSisOpe && !mostrarOffice && !mostrarUsuario && !mostrarTecnico) {
        location.reload(); // Recargar la página
        return;
    }

    // Obtener la tabla y los equipos
    const table = document.querySelector('.equiposP tbody');
    const equipos = table.querySelectorAll('tr');

    // Crear un objeto para agrupar los equipos
    const equiposAgrupados = {};

    // Iterar sobre los equipos y agruparlos según los checkboxes seleccionados
    equipos.forEach(equipo => {
        let claveGrupo = '';

        // Construir la clave de grupo basada en los checkboxes seleccionados
        if (mostrarMarca) {
            const marcaCell = equipo.querySelector('td:nth-child(4)');
            if (marcaCell && marcaCell.textContent.trim() !== '') {
                claveGrupo += marcaCell.textContent;
            }
        }
        if (mostrarModelo) {
            const modeloCell = equipo.querySelector('td:nth-child(5)');
            if (modeloCell && modeloCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca ? ` - ${modeloCell.textContent}` : `${modeloCell.textContent}`;
            }
        }
        if (mostrarProcesador) {
            const procesadorCell = equipo.querySelector('td:nth-child(7)');
            if (procesadorCell && procesadorCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo ? ` - ${procesadorCell.textContent}` : `${procesadorCell.textContent}`;
            }
        }
        if (mostrarMemoria) {
            const memoriaCell = equipo.querySelector('td:nth-child(9)');
            if (memoriaCell && memoriaCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo || mostrarProcesador ? ` - ${memoriaCell.textContent}` : `${memoriaCell.textContent}`;
            }
        }
        if (mostrarAlmacenamiento) {
            const almacenamientoCell = equipo.querySelector('td:nth-child(10)');
            if (almacenamientoCell && almacenamientoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo || mostrarProcesador || mostrarMemoria ? ` - ${almacenamientoCell.textContent}` : `${almacenamientoCell.textContent}`;
            }
        }
        if (mostrarSisOpe) {
            const sisOpeCell = equipo.querySelector('td:nth-child(17)');
            if (sisOpeCell && sisOpeCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo || mostrarProcesador || mostrarMemoria || mostrarAlmacenamiento ? ` - ${sisOpeCell.textContent}` : `${sisOpeCell.textContent}`;
            }
        }
        if (mostrarOffice) {
            const officeCell = equipo.querySelector('td:nth-child(17)');
            if (officeCell && officeCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo || mostrarProcesador || mostrarMemoria || mostrarAlmacenamiento || mostrarSisOpe ? ` - ${officeCell.textContent}` : `${officeCell.textContent}`;
            }
        }
        if (mostrarUsuario) {
            const usuarioCell = equipo.querySelector('td:nth-child(21)'); // Ajuste del índice de columna
            if (usuarioCell && usuarioCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo || mostrarProcesador || mostrarMemoria || mostrarAlmacenamiento || mostrarSisOpe || mostrarOffice ? ` - ${usuarioCell.textContent}` : `${usuarioCell.textContent}`;
            }
        }
        if (mostrarTecnico) {
            const tecnicoCell = equipo.querySelector('td:nth-child(25)');
            if (tecnicoCell && tecnicoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo || mostrarProcesador || mostrarMemoria || mostrarAlmacenamiento || mostrarSisOpe || mostrarOffice || mostrarUsuario ? ` - ${tecnicoCell.textContent}` : `${tecnicoCell.textContent}`;
            }
        }

        // Agregar el equipo al grupo correspondiente si hay contenido en la clave del grupo
        if (claveGrupo !== '') {
            if (!equiposAgrupados[claveGrupo]) {
                equiposAgrupados[claveGrupo] = [];
            }
            equiposAgrupados[claveGrupo].push(equipo.outerHTML);
        }
    });

    // Generar el HTML para mostrar los equipos agrupados en la tabla
    let html = '';
    for (const key in equiposAgrupados) {
        html += `<tr style="background-color: #38a5d8;"><td colspan="25">${key}</td></tr>`; // Encabezado del grupo
        equiposAgrupados[key].forEach(equipo => {
            html += equipo; // Agregar cada equipo del grupo
        });
    }

    // Actualizar el contenido de la tabla
    table.innerHTML = html;
}

function filtrarEquiposIMP() {
    // Obtener el estado de los checkboxes
    const mostrarMarca = document.getElementById('checkMarcaIMP').checked;
    const mostrarModelo = document.getElementById('checkModeloIMP').checked;
    const mostrarTipo = document.getElementById('checkTipoIMP').checked;
    const mostrarPuerto = document.getElementById('checkPuertoIMP').checked;
    const mostrarTecnico = document.getElementById('checkTecnicoIMP').checked;

    // Verificar si no hay ningún checkbox seleccionado
    if (!mostrarMarca && !mostrarModelo && !mostrarTipo && !mostrarPuerto && !mostrarTecnico) {
        location.reload(); // Recargar la página
        return;
    }

    // Obtener la tabla y los equipos
    const table = document.querySelector('.equiposI tbody');
    const equipos = table.querySelectorAll('tr');

    // Crear un objeto para agrupar los equipos
    const equiposAgrupados = {};

    // Iterar sobre los equipos y agruparlos según los checkboxes seleccionados
    equipos.forEach(equipo => {
        let claveGrupo = '';

        // Construir la clave de grupo basada en los checkboxes seleccionados
        if (mostrarMarca) {
            const marcaCell = equipo.querySelector('td:nth-child(4)');
            if (marcaCell && marcaCell.textContent.trim() !== '') {
                claveGrupo += marcaCell.textContent;
            }
        }
        if (mostrarModelo) {
            const modeloCell = equipo.querySelector('td:nth-child(5)');
            if (modeloCell && modeloCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca ? ` - ${modeloCell.textContent}` : `${modeloCell.textContent}`;
            }
        }
        if (mostrarTipo) {
            const tipoCell = equipo.querySelector('td:nth-child(7)');
            if (tipoCell && tipoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo ? ` - ${tipoCell.textContent}` : `${tipoCell.textContent}`;
            }
        }
        if (mostrarPuerto) {
            const puertoCell = equipo.querySelector('td:nth-child(8)');
            if (puertoCell && puertoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo || mostrarTipo ? ` - ${puertoCell.textContent}` : `${puertoCell.textContent}`;
            }
        }
        if (mostrarTecnico) {
            const tecnicoCell = equipo.querySelector('td:nth-child(12)');
            if (tecnicoCell && tecnicoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo || mostrarTipo || mostrarPuerto ? ` - ${tecnicoCell.textContent}` : `${tecnicoCell.textContent}`;
            }
        }

        // Agregar el equipo al grupo correspondiente si hay contenido en la clave del grupo
        if (claveGrupo !== '') {
            if (!equiposAgrupados[claveGrupo]) {
                equiposAgrupados[claveGrupo] = [];
            }
            equiposAgrupados[claveGrupo].push(equipo.outerHTML);
        }
    });

    // Generar el HTML para mostrar los equipos agrupados en la tabla
    let html = '';
    for (const key in equiposAgrupados) {
        html += `<tr style="background-color: #38a5d8;"><td colspan="12">${key}</td></tr>`; // Encabezado del grupo
        equiposAgrupados[key].forEach(equipo => {
            html += equipo; // Agregar cada equipo del grupo
        });
    }

    // Actualizar el contenido de la tabla
    table.innerHTML = html;
}

function filtrarEquiposTLF() {
    // Obtener el estado de los checkboxes
    const mostrarMarca = document.getElementById('checkMarcaTLF').checked;
    const mostrarModelo = document.getElementById('checkModeloTLF').checked;
    const mostrarTecnico = document.getElementById('checkTecnicoTLF').checked;

    // Verificar si no hay ningún checkbox seleccionado
    if (!mostrarMarca && !mostrarModelo && !mostrarTecnico) {
        // Mostrar todos los equipos si no se selecciona ningún filtro
        mostrarTodosEquiposTLF();
        return;
    }

    // Obtener la tabla y los equipos
    const table = document.querySelector('.equiposT');
    const equipos = table.querySelectorAll('tbody tr');

    // Crear un objeto para agrupar los equipos
    const equiposAgrupados = {};

    // Iterar sobre los equipos y agruparlos según los checkboxes seleccionados
    equipos.forEach(equipo => {
        let claveGrupo = '';

        // Construir la clave de grupo basada en los checkboxes seleccionados
        if (mostrarMarca) {
            const marcaCell = equipo.querySelector('td:nth-child(4)');
            if (marcaCell && marcaCell.textContent.trim() !== '') {
                claveGrupo += marcaCell.textContent;
            }
        }
        if (mostrarModelo) {
            const modeloCell = equipo.querySelector('td:nth-child(5)');
            if (modeloCell && modeloCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca ? ` - ${modeloCell.textContent}` : `${modeloCell.textContent}`;
            }
        }
        if (mostrarTecnico) {
            const tecnicoCell = equipo.querySelector('td:nth-child(10)');
            if (tecnicoCell && tecnicoCell.textContent.trim() !== '') {
                claveGrupo += mostrarMarca || mostrarModelo ? ` - ${tecnicoCell.textContent}` : `${tecnicoCell.textContent}`;
            }
        }

        // Agregar el equipo al grupo correspondiente si hay contenido en la clave del grupo
        if (claveGrupo !== '') {
            if (!equiposAgrupados[claveGrupo]) {
                equiposAgrupados[claveGrupo] = [];
            }
            equiposAgrupados[claveGrupo].push(equipo.outerHTML);
        }
    });

    // Generar el HTML para mostrar los equipos agrupados en la tabla
    let html = '';
    for (const key in equiposAgrupados) {
        html += `<tr style="background-color: #38a5d8;"><td colspan="10">${key}</td></tr>`; // Encabezado del grupo
        equiposAgrupados[key].forEach(equipo => {
            html += equipo; // Agregar cada equipo del grupo
        });
    }

    // Actualizar el contenido de la tabla
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = html;
}

function mostrarTodosEquiposTLF() {
    const table = document.querySelector('.equiposTLF');
    const tbody = table.querySelector('tbody');
    const equipos = tbody.querySelectorAll('tr');

    let html = '';
    equipos.forEach(equipo => {
        html += equipo.outerHTML;
    });

    tbody.innerHTML = html;
}

//-------------------------------> REPORTES
async function obtenerYMostrarRegistros(url, idTabla) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            const registros = data.registros;
            const resultsElement = document.getElementById(idTabla);

            if (!resultsElement) {
                console.error(`Elemento de resultados para ${idTabla} no encontrado.`);
                return;
            }

            if (registros.length === 0) {
                resultsElement.innerHTML = `<tr><td colspan="23">No se encontraron registros.</td></tr>`;
                return;
            }

            const html = registros.map(registro => {
                const valores = Object.values(registro);
                const columns = valores.map(value => `<td>${value}</td>`).join('');
                return `<tr>${columns}</tr>`;
            }).join('');

            resultsElement.innerHTML = html;
        } else {
            console.error(`Error al obtener los registros: ${data.message}`);
        }
    } catch (error) {
        console.error(`Error al obtener los registros: ${error}`);
    }
}

//-------------------------------> ENVIAR NOM USER REGIRSTRO
function setUsernameFromURL(spanId) {
    // Obtener el nombre de usuario de la URL
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');

    // Establecer el nombre de usuario en el span
    const usernameSpan = document.getElementById(spanId);
    if (usernameSpan) {
        usernameSpan.textContent = username || 'Usuario no especificado';
    } else {
        console.error(`Elemento con ID ${spanId} no encontrado.`);
    }
}

//-------------------------------> IMPRIMIR EXEL ENTREGAR EQUIPO
function imprimirTabla(tablaId) {
    // Obtener la tabla y su contenido
    const tabla = document.getElementById(tablaId);
    if (!tabla) {
        console.error(`No se encontró ninguna tabla con el ID '${tablaId}'`);
        return;
    }
    const tablaContenido = tabla.outerHTML;

    // Abrir una nueva ventana para la impresión
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.open();
    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Imprimir Tabla</title>
            <style>
                /* Estilos opcionales para la impresión */
                body {
                    font-family: Arial, sans-serif;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table, th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h2>Tabla de Equipos</h2>
            ${tablaContenido}
            <script>
                // Abrir el diálogo de impresión automáticamente
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    ventanaImpresion.document.close();
}

function generarExcel(tablaId) {
    // Obtener la tabla y su contenido
    const tabla = document.getElementById(tablaId);
    if (!tabla) {
        console.error(`No se encontró ninguna tabla con el ID '${tablaId}'`);
        return;
    }

    // Convertir tabla a workbook de Excel
    const wb = XLSX.utils.table_to_book(tabla);

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'equipos.xlsx');
}

//-------------------------------> ENTREGA
function mostrarDatosCPUEntrega(cpu) {
    document.getElementById('nombreHostEntrega').value = cpu.nom_hots;
    document.getElementById('nomUsuarioEntrega').value = cpu.nom_usuario;
    document.getElementById('generacionEntrega').value = cpu.ip_equipo;

    document.getElementById('poseeAntivirusEntrega').value = cpu.antivirus;
    document.getElementById('antivirusEntrega').value = cpu.nom_antivirus;
    document.getElementById('verAntivirusEntrega').value = cpu.ver_antivirus;
    actualizarCamposAntivirus();

    document.getElementById('tecEntrega').textContent = cpu.nom_usua;
    document.getElementById('codigoEntrega').textContent = cpu.cod_cpu;
    document.getElementById('codigoEqEntrega').value = cpu.cod_equipo;
    document.getElementById('codigoticsEntrega').value = cpu.cod_tics_cpu;
    document.getElementById('marcasEntrega').value = cpu.mar_cpu;

    document.getElementById('numSerieEntrega').value = cpu.ser_cpu;
    document.getElementById('MainboardEntrega').value = cpu.tar_madre;
    document.getElementById('procesadorEntrega').value = cpu.procesador;
    document.getElementById('velocidadProceEntrega').value = cpu.velocidad;
    document.getElementById('ramEntrega').value = cpu.memoria;
    document.getElementById('hddEntrega').value = cpu.tam_hdd;
    document.getElementById('disOpticosEntrega').value = cpu.disp_optico;

    document.getElementById('sisOperativoEntrega').value = cpu.sis_ope;
    document.getElementById('officeEntrega').value = cpu.office;

    document.getElementById('estadoEntrega').value = cpu.est_cpu;
    document.getElementById('condicionEntrega').value = cpu.con_cpu;
    document.getElementById('observacionTxtEntrega').value = cpu.observacion;

    marcarCheckBoxes(cpu, escritorioMapping);
}

function mostrarDatosMTREntrega(mtr) {
    document.getElementById('codigoMTREntrega').textContent = mtr.cod_monitor;
    document.getElementById('codigoticsMTREntrega').value = mtr.cod_tics_monitor;
    document.getElementById('codigoEqMTREntrega').value = mtr.cod_equipo;
    document.getElementById('tecMTREntrega').textContent = mtr.nom_usua;
    document.getElementById('marcasMTREntrega').value = mtr.mar_monitor;
    document.getElementById('modeloMTREntrega').value = mtr.mod_monitor;
    document.getElementById('tamanoMTREntrega').value = mtr.tam_monitor;
    document.getElementById('serieMTREntrega').value = mtr.ser_monitor;
    document.getElementById('condicionMTREntrega').value = mtr.con_monitor;
    document.getElementById('estadoMTREntrega').value = mtr.est_monitor;
    document.getElementById('observacionTxtMEntrega').value = mtr.observacion;
}

function mostrarDatosTCDEntrega(tcd) {
    document.getElementById('codigoTCDEntrega').textContent = tcd.cod_teclado;
    document.getElementById('codigoticsTCDEntrega').value = tcd.cod_tics_teclado;
    document.getElementById('codigoEqTCDEntrega').value = tcd.cod_equipo;
    document.getElementById('tecTCDEntrega').textContent = tcd.nom_usua;
    document.getElementById('marcasTCDEntrega').value = tcd.mar_teclado;
    document.getElementById('puertoTCDEntrega').value = tcd.pue_teclado;
    document.getElementById('tipoTCDEntrega').value = tcd.tip_teclado;
    document.getElementById('serieTCDEntrega').value = tcd.ser_teclado;
    document.getElementById('modeloTCDEntrega').value = tcd.mod_teclado;
    document.getElementById('condicionTCDEntrega').value = tcd.con_teclado;
    document.getElementById('estadoTCDEntrega').value = tcd.est_teclado;
    document.getElementById('observacionTxtTCDEntrega').value = tcd.obs_teclado;
}

function mostrarDatosMSEntrega(ms) {
    document.getElementById('codigoMSEntrega').textContent = ms.cod_mouse;
    document.getElementById('codigoticsMSEntrega').value = ms.cod_tics_mouse;
    document.getElementById('codigoEqMSEntrega').value = ms.cod_equipo;
    document.getElementById('tecMSEntrega').textContent = ms.nom_usua;
    document.getElementById('marcasMSEntrega').value = ms.mar_mouse;
    document.getElementById('puertoMSEntrega').value = ms.puerto;
    document.getElementById('tipoMSEntrega').value = ms.tip_mouse;
    document.getElementById('serieMSEntrega').value = ms.ser_mouse;
    document.getElementById('modeloMSEntrega').value = ms.mod_mouse;
    document.getElementById('condicionMSEntrega').value = ms.con_mouse;
    document.getElementById('estadoMSEntrega').value = ms.est_mouse;
    document.getElementById('observacionTxtMSEntrega').value = ms.obs_mouse;
}

function abrirModalYMostrarTodosDatos() {
    // Obtener el ID del equipo desde el span
    const idEquipo = document.getElementById('cod').innerText.trim();
    mostrarVentanaEmergente('modal11');
    // Llamar a una función para obtener y mostrar todos los datos
    obtenerDatosEntrega('cpu_equipo', idEquipo);
    obtenerDatosEntrega('monitor', idEquipo);
    obtenerDatosEntrega('teclado', idEquipo);
    obtenerDatosEntrega('mouse', idEquipo);
    cerrarVentanaEmergente('modal1');
}

async function obtenerDatosEntrega(tabla, codEquipo) {
    try {
        const response = await fetch(`http://localhost:3000/tics/datosTabla/${tabla}/${codEquipo}`);
        const data = await response.json();

        if (data.success) {
            const componente = data[tabla]; // Acceder correctamente a los datos del componente
            console.log("Datos de la tabla:", componente);
            // Verificar la tabla y llamar a la función correspondiente
            if (tabla === "cpu_equipo") {
                mostrarDatosCPUEntrega(componente);
            } else if (tabla === "monitor") {
                mostrarDatosMTREntrega(componente);
            } else if (tabla === "mouse") {
                mostrarDatosMSEntrega(componente);
            } else if (tabla === "teclado") {
                mostrarDatosTCDEntrega(componente);
                // } else if (tabla === "laptop") {
                //     mostrarDatosPLT(componente);
                // } else if (tabla === "impresora") {
                //     mostrarDatosIMP(componente);
                // } else if (tabla === "telefono") {
                //     mostrarDatosTLF(componente);
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

function generarPDF() {
    window.jsPDF = window.jspdf.jsPDF;
    // Crear un nuevo documento jsPDF
    const doc = new jsPDF();

    // DATOS EQUIPO
    const idEquipo = document.getElementById("cod").textContent.trim();
    const fechaEntrega = document.getElementById("fecha").textContent.trim();
    const tecnico = document.getElementById("tecnico").textContent.trim();
    const codAlmacen = document.getElementById("codAlmacen").value.trim();
    const pisoUbicado = document.getElementById("pisos").value.trim();
    const titular = document.getElementById("titularEq").value.trim();
    const departamento = document.getElementById("departamentos").value.trim();
    const usuario = document.getElementById("titularEq").value.trim();
    // CPU
    const marca = document.getElementById('marcasEntrega').value;
    const tarjeta = document.getElementById('MainboardEntrega').value;
    const serie = document.getElementById('numSerieEntrega').value;
    const proces = document.getElementById('procesadorEntrega').value;
    const velocidad = document.getElementById('velocidadProceEntrega').value;
    const ram = document.getElementById('ramEntrega').value;
    const hdd = document.getElementById('hddEntrega').value;
    const sisOpe = document.getElementById('sisOperativoEntrega').value;
    const office = document.getElementById('officeEntrega').value;
    const estado = document.getElementById('condicionEntrega').value;
    const observacion = document.getElementById("observacionTxtEntrega").value.trim();
    // MONITOR
    const marcaM = document.getElementById('marcasMTREntrega').value;
    const modeloM = document.getElementById('modeloMTREntrega').value;
    const tamanoM = document.getElementById('tamanoMTREntrega').value;
    const serieM = document.getElementById('serieMTREntrega').value;
    const estadoM = document.getElementById('condicionMTREntrega').value;
    // TECLADO
    const marcaT = document.getElementById('marcasTCDEntrega').value;
    const serieT = document.getElementById('serieTCDEntrega').value;
    const modeloT = document.getElementById('modeloTCDEntrega').value;
    const estadoT = document.getElementById('condicionTCDEntrega').value;
    // MOUSE
    const marcaMS = document.getElementById('marcasMSEntrega').value;
    const serieMS = document.getElementById('serieMSEntrega').value;
    const modeloMS = document.getElementById('modeloMSEntrega').value;
    const estadoMS = document.getElementById('condicionMSEntrega').value;

    doc.setFontSize(8);
    // Horizontal Vertical
    doc.setFont("helvetica", "bold");
    doc.text(`El Equipo se entrega:`, 20, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`FUNCIONAL`, 50, 20);

    doc.setFont("helvetica", "bold");
    doc.text(`Código TICS:`, 90, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`${codAlmacen}`, 110, 20);

    doc.setFont("helvetica", "bold");
    doc.text(`Custodio:`, 20, 25);
    doc.setFont("helvetica", "normal");
    doc.text(`${titular}`, 45, 25);

    // Mostrar "Unidad" en negrita
    doc.setFont("helvetica", "bold");
    doc.text(`Unidad:`, 20, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`${departamento}`, 40, 40);

    doc.setFont("helvetica", "bold");
    doc.text(`Piso:`, 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${pisoUbicado}`, 35, 50);

    // Mostrar "Fecha" en negrita
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha:`, 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${fechaEntrega}`, 40, 60);

    // Definir los datos a mostrar en la tabla del PDF
    const tableData = [
        ['CPU', 'Marca', marca],
        ['CPU', 'Modelo', tarjeta],
        ['CPU', 'Núm Serie', serie],
        ['CPU', 'Procesador', proces],
        ['CPU', 'Velocidad', velocidad],
        ['CPU', 'Memoria RAM', ram],
        ['CPU', 'Almacenamiento', hdd],
        ['MONITOR', 'Marca', marcaM],
        ['MONITOR', 'Modelo', modeloM],
        ['MONITOR', 'Tamaño', tamanoM],
        ['MONITOR', 'Núm Serie', serieM],
        ['TECLADO', 'Marca', marcaT],
        ['TECLADO', 'Núm Serie', serieT],
        ['TECLADO', 'Modelo', modeloT],
        ['MOUSE', 'Marca', marcaMS],
        ['MOUSE', 'Núm Serie', serieMS],
        ['MOUSE', 'Modelo', modeloMS]
    ];

    doc.setFont("helvetica", "bold");
    doc.text(`Sistema Operativo:`, 20, 160);
    doc.setFont("helvetica", "normal");
    doc.text(`${sisOpe}`, 50, 160);

    doc.setFont("helvetica", "bold");
    doc.text(`Office:`, 20, 170);
    doc.setFont("helvetica", "normal");
    doc.text(`${office}`, 30, 170);

    const tableDataEst = [
        ['CPU', `${estado}`, 'MONITOR', `${estadoM}`],
        ['TECLADO', `${estadoT}`, 'MOUSE', `${estadoMS}`]
    ];
    // Ancho total de la página
    const pageWidth = doc.internal.pageSize.getWidth()
    const tableWidth = pageWidth * 0.75; // 85% del ancho de la página

    doc.setFont("helvetica", "bold");
    doc.text(`OBSERVACION:`, 20, 205);
    doc.setFont("helvetica", "normal");
    const maxWidth = 165; // Ancho máximo para el texto
    const textYPosition = 210; // Posición vertical inicial del texto
    const splitObservacion = doc.splitTextToSize(observacion, maxWidth);
    doc.text(splitObservacion, 20, textYPosition);

    const tableDataFirma = [
        ['REALIZADO POR:', 'ENTREGADO A:'],
        ['\n\n\n','\n\n',],
        [`ANALISTA TICS: ${tecnico}`,`FUNCIONARIO: ${usuario}`]
    ];

    // Configurar la estructura de la tabla
    doc.autoTable({
        startY: 65,
        body: tableData.map(row => [row[1], row[2]]),
        columnStyles: {
            0: { cellWidth: 50 }, // Ancho para la primera columna ('Característica')
            1: { cellWidth: 60 }, // Ancho para la segunda columna ('Valor')
        },
        styles: {
            fontSize: 8,
            cellPadding: { top: 1, right: 2, bottom: 1, left: 2 }, // Reducir el cellPadding para disminuir la altura de las filas
            valign: 'middle',
            halign: 'left',
            textColor: [0, 0, 0], // Color de texto negro
            lineWidth: 0.1, // Grosor de la línea
            lineColor: [0, 0, 0] // Color de la línea
        },
        theme: 'grid',
        margin: { left: 75, right: 20 }, // Añadir margen izquierdo y derecho
        tableWidth: 'wrap', // Ajustar el ancho de la tabla al contenido
        didDrawCell: function (data) {
            if (data.section === 'body' && data.column.index === 0) {
                let cellHeight = 0;
                let yPos = data.cell.y;
                let text = '';
                if (data.row.index === 0) {
                    cellHeight = data.cell.height * 7;
                    text = 'CPU';
                } else if (data.row.index === 7) {
                    cellHeight = data.cell.height * 4;
                    text = 'MONITOR';
                } else if (data.row.index === 11) {
                    cellHeight = data.cell.height * 3;
                    text = 'TECLADO';
                } else if (data.row.index === 14) {
                    cellHeight = data.cell.height * 3;
                    text = 'MOUSE';
                }
                if (text) {
                    const cellWidth = data.cell.width;
                    const xPos = data.cell.x - cellWidth;
                    doc.setFillColor(255, 255, 255); // Color de fondo blanco
                    doc.rect(xPos, yPos, cellWidth, cellHeight, 'FD'); // Dibuja un rectángulo blanco con bordes
                    doc.setFont("helvetica", "bold");
                    doc.text(text, xPos + cellWidth / 2, yPos + cellHeight / 2, { align: 'center', baseline: 'middle' });
                }
            }
        }
    });

    doc.autoTable({
        startY: 180,
        head: [[{ content: 'ESTADO DEL EQUIPO', colSpan: 4, styles: { halign: 'center', textColor: [255, 255, 255] } }]],
        body: tableDataEst,
        styles: {
            fontSize: 8,
            cellPadding: { top: 1, right: 2, bottom: 1, left: 2 }, // Reducir el cellPadding para disminuir la altura de las filas
            valign: 'middle',
            halign: 'left',
            textColor: [0, 0, 0], // Color de texto negro
            lineWidth: 0.1, // Grosor de la línea
            lineColor: [0, 0, 0] // Color de la línea
        },
        headStyles: {
            fillColor: [22, 160, 133], // Color de fondo del encabezado (verde)
            textColor: [255, 255, 255] // Color del texto del encabezado (blanco)
        },
        margin: { left: (pageWidth - tableWidth) / 2, right: (pageWidth - tableWidth) / 2 }, // Márgenes para centrar la tabla
        tableWidth: tableWidth
    });

    doc.autoTable({
        startY: 230,
        head: [tableDataFirma[0]], // Primera fila como encabezado
        body: [tableDataFirma[1], tableDataFirma[2]],
        styles: {
            fontSize: 10,
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 }, // Estilos generales
            valign: 'middle',
            halign: 'left',
            textColor: [0, 0, 0], // Color de texto negro
            lineWidth: 0.1, // Grosor de la línea
            lineColor: [0, 0, 0] // Color de la línea
        },
        rowStyles: {
            0: { cellPadding: { top: 20, bottom: 20 } } // Aumentar el padding en la segunda fila para aumentar la altura
        },
        headStyles: {
            fillColor: [255, 255, 255], // Sin color de fondo para el encabezado
            textColor: [0, 0, 0] // Color del texto del encabezado
        },
        margin: { left: (pageWidth - tableWidth) / 2, right: (pageWidth - tableWidth) / 2 },
    });

    
    // Obtener y agregar datos de los formularios visibles
    const formContainers = document.querySelectorAll('.form-container[style="display: block;"]');
    formContainers.forEach(formContainer => {
        // Obtener todos los elementos input, select, textarea dentro del formulario visible
        const formData = [];
        const formElements = formContainer.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            let fieldName = element.id || element.name;
            let fieldValue = element.value;
            // Agregar solo si el campo tiene un valor
            if (fieldName && fieldValue) {
                formData.push([element.previousElementSibling.textContent, fieldValue]);
            }
        });

        // Agregar los datos del formulario al PDF
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 10, // Posicionar debajo de la tabla anterior
            head: [['Campo', 'Valor']],
            body: formData,
            styles: commonStyles, // Aplicar los estilos comunes a la tabla del formulario
        });
    });

    // Guardar el documento PDF
    doc.save('equipo.pdf');
}


//-------------------------------> FUNCION PRINCIPAL
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('newTecnico')) {
        setUsernameFromURL('newTecnico');
    }
    //-------------------------------> INGRESO DE NUEVO EQUIPO
    const setDefaultValue = (elementId, value) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = value;
        }
    };

    if (document.getElementById('newCodAlmacen')) {
        setDefaultValue('newCodAlmacen', 'CZ9TICS-');
    }
    if (document.getElementById('codigoticsMTR')) {
        setDefaultValue('codigoticsMTR', 'CZ9TICS-MON-');
    }
    if (document.getElementById('codigoticsTCD')) {
        setDefaultValue('codigoticsTCD', 'CZ9TICS-TEC-');
    }
    if (document.getElementById('codigoticsMS')) {
        setDefaultValue('codigoticsMS', 'CZ9TICS-MOU-');
    }
    if (document.getElementById('codigoticsTLF')) {
        setDefaultValue('codigoticsTLF', 'CZ9TICS-TEL-');
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
    if (document.getElementById('newCodigoMTR')) {
        mostrarProximoCodEquipo('monitor', 'newCodMTR');
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
    if (document.getElementById('ultimosCodAlmacenArea')) {
        obtenerUltimosCodAlmacen();
    }

    //-------------------------------> Verificar y mostrarContenidoTabla 
    const mostrarTablaIfExists = (tableName, resultId, modalId) => {
        const resultsElement = document.getElementById(resultId);
        if (resultsElement) {
            mostrarContenidoTabla(tableName, resultId, modalId);
        }
    };
    mostrarTablaIfExists('Escritorio', 'results', 'modal1');
    mostrarTablaIfExists('Portatil', 'resultsPortatil', 'modal4');
    mostrarTablaIfExists('Impresora', 'resultsImpresora', 'modal5');
    mostrarTablaIfExists('Teléfono', 'resultsTelefono', 'modal6');

    //-------------------------------> Mostrar registros Reporte
    if (document.getElementById('resultsCPU')) {
        obtenerYMostrarRegistros('http://localhost:3000/tics/reporte/cpu_equipo', 'resultsCPU');
    }

    if (document.getElementById('resultsPTL')) {
        obtenerYMostrarRegistros('http://localhost:3000/tics/reporte/laptop', 'resultsPTL');
    }

    if (document.getElementById('resultsIMP')) {
        obtenerYMostrarRegistros('http://localhost:3000/tics/reporte/impresora', 'resultsIMP')
    }

    if (document.getElementById('resultsTLF')) {
        obtenerYMostrarRegistros('http://localhost:3000/tics/reporte/telefono', 'resultsTLF');
    }
    //obtenerYMostrarRegistros('http://localhost:3000/tics/reporte/cpu_equipo', 'resultsCPU');
    //obtenerYMostrarRegistros('http://localhost:3000/tics/reporte/laptop', 'resultsPTL');
    //obtenerYMostrarRegistros('http://localhost:3000/tics/reporte/impresora', 'resultsIMP');
    //obtenerYMostrarRegistros('http://localhost:3000/tics/reporte/telefono', 'resultsTLF');

    //-------------------------------> Verificar y llamar a getOptionsFrom solo si el elemento existe
    const optionMappings = [
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionMTR' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionMTREntrega' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionTCD' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionTCDEntrega' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionMS' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionMSEntrega' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicion' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionEntrega' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionIMP' },
        { table: 'param_condicion', field: 'nom_condicion', id: 'condicionTLF' },

        { table: 'param_sis_ope', field: 'nom_sis_ope', id: 'sisOperativo' },
        { table: 'param_sis_ope', field: 'nom_sis_ope', id: 'sisOperativoEntrega' },
        { table: 'param_sis_ope', field: 'nom_sis_ope', id: 'sisOperativoPTL' },

        { table: 'param_procesador', field: 'nom_proce', id: 'procesador' },
        { table: 'param_procesador', field: 'nom_proce', id: 'procesadorEntrega' },
        { table: 'param_procesador', field: 'nom_proce', id: 'procesadorPTL' },

        { table: 'param_dis_opt', field: 'nom_dis_opt', id: 'disOpticos' },
        { table: 'param_dis_opt', field: 'nom_dis_opt', id: 'disOpticosEntrega' },
        { table: 'param_dis_opt', field: 'nom_dis_opt', id: 'disOpticosPTL' },

        { table: 'param_tamano_hdd', field: 'nom_tam_hdd', id: 'hdd' },
        { table: 'param_tamano_hdd', field: 'nom_tam_hdd', id: 'hddEntrega' },
        { table: 'param_tamano_hdd', field: 'nom_tam_hdd', id: 'hddPTL' },

        { table: 'param_office', field: 'nom_office', id: 'office' },
        { table: 'param_office', field: 'nom_office', id: 'officeEntrega' },
        { table: 'param_office', field: 'nom_office', id: 'officePTL' },

        { table: 'param_memoria', field: 'nom_memoria', id: 'ram' },
        { table: 'param_memoria', field: 'nom_memoria', id: 'ramEntrega' },
        { table: 'param_memoria', field: 'nom_memoria', id: 'ramPTL' },

        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasMTR' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasMTREntrega' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasTCD' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasTCDEntrega' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasMS' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasMSEntrega' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcas' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasEntrega' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasPTL' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasIMP' },
        { table: 'param_marcas', field: 'nom_marcas', id: 'marcasTLF' },

        { table: 'param_estado', field: 'nom_estado', id: 'estadoMTR' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoMTREntrega' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoTCD' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoTCDEntrega' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoMS' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoMSEntrega' },
        { table: 'param_estado', field: 'nom_estado', id: 'estado' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoEntrega' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoPTL' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoIMP' },
        { table: 'param_estado', field: 'nom_estado', id: 'estadoTLF' },

        { table: 'param_puertos', field: 'nom_puerto', id: 'puertoTCD' },
        { table: 'param_puertos', field: 'nom_puerto', id: 'puertoTCDEntrega' },
        { table: 'param_puertos', field: 'nom_puerto', id: 'puertoMS' },
        { table: 'param_puertos', field: 'nom_puerto', id: 'puertoMSEntrega' },
        { table: 'param_puertos', field: 'nom_puerto', id: 'puerto' },
        { table: 'param_puertos', field: 'nom_puerto', id: 'puertoIMP' },

        { table: 'param_tipo_mt', field: 'nom_tmt', id: 'tipoTCD' },
        { table: 'param_tipo_mt', field: 'nom_tmt', id: 'tipoTCDEntrega' },
        { table: 'param_tipo_mt', field: 'nom_tmt', id: 'tipoMS' },
        { table: 'param_tipo_mt', field: 'nom_tmt', id: 'tipoMSEntrega' },

        { table: 'param_tamano_monitor', field: 'nom_tam_mon', id: 'tamanoMTR' },
        { table: 'param_tamano_monitor', field: 'nom_tam_mon', id: 'tamanoMTREntrega' },
        { table: 'param_servicio', field: 'nom_servicio', id: 'departamentos' },

        { table: 'param_antivirus', field: 'nom_antivirus', id: 'antivirus' },
        { table: 'param_antivirus', field: 'nom_antivirus', id: 'antivirusEntrega' },
        { table: 'param_antivirus', field: 'nom_antivirus', id: 'antivirusPTL' },

        { table: 'param_tipo_impresora', field: 'nom_ti', id: 'tipoIMP' },

        { table: 'param_tipo_equipo', field: 'nom_te', id: 'tipoEquipo' },
        { table: 'param_tipo_equipo', field: 'nom_te', id: 'newTipoEquipo' },

        { table: 'param_piso', field: 'nom_piso', id: 'pisos' }
    ];

    optionMappings.forEach(mapping => {
        if (document.getElementById(mapping.id)) {
            getOptionsFrom(mapping.table, mapping.field, mapping.id);
        }
    });
});
