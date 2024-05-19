async function mostrarContenidoTabla() {
    const resultsElement = document.getElementById('results');

    try {
        const response = await fetch(`http://localhost:3000/tics/equipos`);
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
                                                mostrarVentanaEmergente('modal1')">Equipo</button>
                            </td>
                        </tr>`;
                //obtenerDatosTabla('cpu_equipo','${equipo.cod_equipo}')
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
    try {
        const response = await fetch(`http://localhost:3000/tics/options/${tabla}/${campo}`);
        const data = await response.json();

        if (data.success) {
            const options = data.options;
            const select = document.getElementById(selectId);

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
    //-------------------------------> Selects Equipo
    getOptionsFrom('param_tipo_equipo', 'nom_te', 'tipoEquipo');
    getOptionsFrom('param_piso', 'nom_piso', 'pisos');
    getOptionsFrom('param_servicio', 'nom_servicio', 'departamentos');

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

function actualizarCamposAntivirus() {
    const nuevoPoseeAntivirus = document.getElementById('poseeAntivirus').value;
    const antivirusCPU = document.getElementById('antivirusCPU');
    const verAntivirus = document.getElementById('verAntivirus');

    if (nuevoPoseeAntivirus === 'NO') {
        antivirusCPU.value = ''; // Establecer en blanco
        verAntivirus.value = ''; // Establecer en blanco
    }
}

function marcarCheckBoxes(cpu) {
    const redFijaCheckbox = document.getElementById('redFija');
    redFijaCheckbox.checked = cpu.red_fija === 'SI';

    const redInalamCheckbox = document.getElementById('redInalam');
    redInalamCheckbox.checked = cpu.red_inalam === 'SI';

    const bluetoothCheckbox = document.getElementById('bluetooth');
    bluetoothCheckbox.checked = cpu.bluetooth === 'SI';

    const lectorTarjetaCheckbox = document.getElementById('lectorTarjeta');
    lectorTarjetaCheckbox.checked = cpu.lec_tarjeta === 'SI';
}

function mostrarDatosCPU(cpu) {
    document.getElementById('nombreHost').value = cpu.nom_hots;
    document.getElementById('nomUsuario').value = cpu.nom_usuario;
    document.getElementById('generacion').value = cpu.ip_equipo;

    document.getElementById('poseeAntivirus').value = cpu.antivirus;
    document.getElementById('antivirusCPU').value = cpu.nom_antivirus;
    document.getElementById('verAntivirus').value = cpu.ver_antivirus;
    actualizarCamposAntivirus();

    document.getElementById('tecCPU').textContent = cpu.nom_usua;
    document.getElementById('codigoCPU').textContent = cpu.cod_cpu;
    document.getElementById('codigoEqCPU').value = cpu.cod_equipo;
    document.getElementById('codigoticsCPU').value = cpu.cod_tics_cpu;
    document.getElementById('marcasCPU').value = cpu.mar_cpu;

    document.getElementById('numSerieCPU').value = cpu.ser_cpu;
    document.getElementById('Mainboard').value = cpu.tar_madre;
    document.getElementById('procesador').value = cpu.procesador;
    document.getElementById('velocidadProce').value = cpu.velocidad;
    document.getElementById('ram').value = cpu.memoria;
    document.getElementById('hdd').value = cpu.tam_hdd;
    document.getElementById('disOpticos').value = cpu.disp_optico;

    document.getElementById('sisOperativo').value = cpu.sis_ope;
    document.getElementById('office').value = cpu.office;

    document.getElementById('condicionCPU').value = cpu.con_cpu;
    document.getElementById('observacionTxt').value = cpu.observacion;

    marcarCheckBoxes(cpu);
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
            } else {
                console.error("Tabla desconocida:", tabla);
            }
        } else {
            console.error('Error al obtener datos de la tabla:', data.message);
        }
    } catch (error) {
        console.error('Error al obtener datos de la tabla:', error);
    }
}

async function guardarCambiosCPU() {
    try {
        const codCPU = document.getElementById('codigoCPU').textContent;
        const codEquipo = document.getElementById('codigoEqCPU').value;
        const codTicsCPU = document.getElementById('codigoticsCPU').value;
        const nuevaMarcaCPU = document.getElementById('marcasCPU').value;
        const nuevoNumSerieCPU = document.getElementById('numSerieCPU').value;
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
        const nuevoNomAntivirus = document.getElementById('antivirusCPU').value;
        const nuevaVerAntivirus = document.getElementById('verAntivirus').value;

        const nuevoHost = document.getElementById('nombreHost').value;
        const nuevoUsuario = document.getElementById('nomUsuario').value;
        const nuevaGeneracion = document.getElementById('generacion').value;
        const nuevaCondicion = document.getElementById('condicionCPU').value;
        const nuevoEstado = document.getElementById('estadoCPU').value;
        const nuevaObservacion = document.getElementById('observacionTxt').value;

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

document.addEventListener('DOMContentLoaded', async () => {
    await mostrarContenidoTabla();
    //-------------------------------> Selects CPU
    getOptionsFrom('param_marcas', 'nom_marcas', 'marcasCPU');
    getOptionsFrom('param_procesador', 'nom_proce', 'procesador');
    getOptionsFrom('param_memoria', 'nom_memoria', 'ram');
    getOptionsFrom('param_tamano_hdd', 'nom_tam_hdd', 'hdd');
    getOptionsFrom('param_dis_opt', 'nom_dis_opt', 'disOpticos');
    getOptionsFrom('param_sis_ope', 'nom_sis_ope', 'sisOperativo');
    getOptionsFrom('param_office', 'nom_office', 'office');
    getOptionsFrom('param_antivirus', 'nom_antivirus', 'antivirusCPU');
    getOptionsFrom('param_condicion', 'nom_condicion', 'condicionCPU');
    getOptionsFrom('param_estado', 'nom_estado', 'estadoCPU');

    //-------------------------------> Selects MTR
    getOptionsFrom('param_marcas', 'nom_marcas', 'marcasMTR');
    getOptionsFrom('param_tamano_monitor', 'nom_tam_mon', 'tamanoMTR')
    getOptionsFrom('param_condicion', 'nom_condicion', 'condicionMTR');
    getOptionsFrom('param_estado', 'nom_estado', 'estadoMTR');

    //-------------------------------> Selects TCD
    getOptionsFrom('param_marcas', 'nom_marcas', 'marcasTCD');
    getOptionsFrom('param_puertos', 'nom_puerto', 'puertoTCD');
    getOptionsFrom('param_tipo_mt', 'nom_tmt', 'tipoTCD');
    getOptionsFrom('param_condicion', 'nom_condicion', 'condicionTCD');
    getOptionsFrom('param_estado', 'nom_estado', 'estadoTCD');

    //-------------------------------> Selects MS
    getOptionsFrom('param_marcas', 'nom_marcas', 'marcasMS');
    getOptionsFrom('param_puertos', 'nom_puerto', 'puertoMS');
    getOptionsFrom('param_tipo_mt', 'nom_tmt', 'tipoMS');
    getOptionsFrom('param_condicion', 'nom_condicion', 'condicionMS');
    getOptionsFrom('param_estado', 'nom_estado', 'estadoMS');
});

