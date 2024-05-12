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
                            <td><button id="openModalBtn" onclick="llenarCampos('${equipo.cod_equipo}', 
                                                                                '${fecha}', 
                                                                                '${equipo.cod_almacen}', 
                                                                                '${equipo.tip_equipo}', 
                                                                                '${equipo.piso_ubic}', 
                                                                                '${equipo.serv_depar}', 
                                                                                '${equipo.nom_custodio}', 
                                                                                '${equipo.nom_usua}'), 
                                                                    mostrarVentanaEmergente('modal1')">Editar Equipo</button></td>
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

function llenarCampos(codEquipo, fecha, codAlmacen, tipoEquipo, piso, departamento, titular, tecnico) {
    const campos = {
        'cod': codEquipo,
        'fecha': fecha,
        'codAlmacen': codAlmacen,
        'tipoEquipo': tipoEquipo,
        'pisos': piso,
        'departamentos': departamento,
        'titularEq': titular,
        'tecnico': tecnico
    };
    Object.keys(campos).forEach(key => {
        const elemento = document.getElementById(key);
        if (elemento) {
            if (elemento.tagName === 'INPUT') {
                elemento.value = campos[key];
            } else {
                elemento.textContent = campos[key];
            }
        }
    });

    //-------------------------------> Selects Equipo
    getOptionsFrom('param_tipo_equipo', 'nom_te', 'tipoEquipo');
    getOptionsFrom('param_piso', 'nom_piso', 'pisos');
    getOptionsFrom('param_servicio', 'nom_servicio', 'departamentos');
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

function guardarCambiosEq() {
    const codEquipo = document.getElementById('cod').textContent; // De alguna manera obtienes el código del equipo que se está modificando
    const newCodAlmacen = document.getElementById('codAlmacen').value;
    const newTipoEquipo = document.getElementById('tipoEquipo').value;
    const newPiso = document.getElementById('pisos').value;
    const newDepartamento = document.getElementById('departamentos').value;
    const newTitular = document.getElementById('titularEq').value;

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
            // Aquí podrías hacer algo si la modificación se realizó con éxito, como mostrar un mensaje al usuario
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
Nuevo Custodio: LIBRE`);
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

async function datosCPU(codEquipo) {
    try {
        const response = await fetch(`http://localhost:3000/tics/cpu/${codEquipo}`);
        const data = await response.json();

        if (data.success) {
            mostrarDatosCPU(data.cpu);
        } else {
            console.error('Error al obtener los datos del CPU:(', data.message);
        }
    } catch (error) {
        console.error('Error al obtener los datos del CPU:', error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await mostrarContenidoTabla();
});

