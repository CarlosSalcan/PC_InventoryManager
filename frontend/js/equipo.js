async function mostrarContenidoTabla() {
    try {
        const response = await fetch(`http://localhost:3000/tics/equipos`);
        const data = await response.json();

        if (data.success) {
            const equipos = data.equipos;
            let html = '';
            equipos.forEach((equipo) => {
                const fecha = new Date(equipo.fec_reg).toISOString().split('T')[0]; // Obtener solo la parte de la fecha
                html += `<tr>
                            <td>${equipo.cod_equipo}</td>
                            <td>${fecha}</td>
                            <td>${equipo.cod_almacen}</td>
                            <td>${equipo.tip_equipo}</td>
                            <td>${equipo.piso_ubic}</td>
                            <td>${equipo.serv_depar}</td>
                            <td>${equipo.nom_custodio}</td>
                            <td>${equipo.nom_usua}</td>
                            <td><button class="copy" id="openModalBtn" onclick="llenarCampos('${equipo.cod_equipo}', '${fecha}', '${equipo.cod_almacen}', '${equipo.tip_equipo}', '${equipo.piso_ubic}', '${equipo.serv_depar}', '${equipo.nom_custodio}', '${equipo.nom_usua}'),mostrarVentanaEmergente('modal1'), datosCPU('${equipo.cod_equipo}')">
                                    <span data-text-end="Editando!" data-text-initial="Editar" class="tooltip"></span>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="edit">
                                            <path fill="currentColor" d="M19.996 2.006c-1.109-.002-2.215.428-3.052 1.267L6.09 13.13a.999.999 0 0 0-.258.437l-1.302 4.672a1 1 0 0 0 1.266 1.267l4.672-1.302a1 1 0 0 0 .437-.258l9.857-9.855A4.29 4.29 0 0 0 22 6.007c0-1.123-.436-2.229-1.004-3.001a4.296 4.296 0 0 0-1.004-1.001zm-2.222 3.224L8.929 16.81l-2.929.816.815-2.929L17.774 4.23l.001.001 1.001-1.001zM7.183 17.816l-2.001.556.556-2 8.03-8.028 1.445 1.444-8.03 8.028-2 0.556.556-2z"/>
                                        </svg>
                                    </span>
                                </button>                       
                            </td>
                            <td><button class="copy" onclick="enviarBodega(${equipo.cod_equipo})">
                            <span data-text-end="Enviando!" data-text-initial="Enviar a Bodega" class="tooltip"></span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" class="folder">
                                    <path fill="currentColor" d="M20 4H10l-2-2H4c-1.103 0-1.99.897-1.997 2L2 18c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 18V6h16v12H4zm6-10h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1z"/>
                                </svg>
                            </span>
                                </button>
                            </td>
                        </tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('searchResults').innerHTML = html;
        } else {
            document.getElementById('searchResults').innerHTML = '<p>No se encontraron equipos.</p>';
        }
    } catch (error) {
        document.getElementById('searchResults').innerHTML = '<p>Ocurrió un error al cargar el contenido de la tabla.</p>';
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

async function enviarBodega(codEquipo) {
    try {
        // Obtener la información del equipo de la base de datos
        const equipoResponse = await fetch(`http://localhost:3000/tics/equipo/${codEquipo}`);
        const equipoData = await equipoResponse.json();

        // Mostrar una ventana de confirmación detallada al usuario
        const confirmacion = confirm(`ESTA SEGUR@ DE ENVIAR A BODEGA EL SIGUIENTE EQUIPO:
    \u2022 Código: ${equipoData.equipo.cod_equipo}
    \u2022 Ubicación Actual: ${equipoData.equipo.piso_ubic}
    \u2022 Serv/Depar Actual: ${equipoData.equipo.serv_depar}
    \u2022 Custodio Actual: ${equipoData.equipo.nom_custodio}

EL EQUIPO SERA MODIFICADO A:
    \u2022 Nueva Ubicación: SUBSUELO
    \u2022 Serv/Depar Nuevo: BODEGA / ACTIVOS FIJOS
    \u2022 Nuevo Custodio: LIBRE`);
        if (!confirmacion) {
            return; // Si el usuario cancela, no hacemos nada
        }

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
            mostrarContenidoTabla();
        } else {
            console.error('Error al editar equipo:', data.message);
        }
    } catch (error) {
        console.error('Error al editar equipooo:', error);
    }
}

async function getOptionsFrom(tabla, campo, selectId) {
    try {
        const response = await fetch(`http://localhost:3000/tics/options/${tabla}/${campo}`);
        const data = await response.json();

        if (data.success) {
            const options = data.options;
            const select = document.getElementById(selectId);

            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.text = option;
                select.appendChild(optionElement);
            });
        } else {
            console.error('Error al obtener opciones:', data.message);
        }
    } catch (error) {
        console.error('Error al obtener opciones:', error);
    }
}

async function datosCPU(codEquipo) {
    try {
        const response = await fetch(`http://localhost:3000/tics/cpu/${codEquipo}`);
        const data = await response.json();

        if (data.success) {
            const cpu = data.cpu;
            document.getElementById('codCPU').textContent = cpu.cod_cpu;
            document.getElementById('marcaCPU').textContent = cpu.mar_cpu;
            document.getElementById('serieCPU').textContent = cpu.ser_cpu;
            // Llenar el select de TarjetaMadre con opciones relacionadas con el CPU, si es necesario
            // document.getElementById('TarjetaMadre').innerHTML = ...
        } else {
            // Manejar caso de error
            console.error('Error al obtener los datos del CPU:', data.message);
        }
    } catch (error) {
        // Manejar errores de red u otros errores
        console.error('Error al obtener los datos del CPU:', error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await mostrarContenidoTabla();
    getOptionsFrom('param_tipo_equipo', 'nom_te', 'tipoEquipo');
    getOptionsFrom('param_piso', 'nom_piso', 'pisos');
    getOptionsFrom('param_servicio', 'nom_servicio', 'departamentos');
});

/*function setearFechaActual() {
    const inputFecha = document.getElementById('fechaActual');
    const fechaActual = new Date().toISOString().split('T')[0];
    inputFecha.value = fechaActual;
}
*/
