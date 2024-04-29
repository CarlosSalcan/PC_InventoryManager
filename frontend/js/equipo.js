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
                            <td><button class="button" id="openModalBtn" onclick="mostrarVentanaEmergente()">
                                    <svg class="svg-icon" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <g stroke="#a649da" stroke-linecap="round" stroke-width="2">
                                            <path d="m20 20h-16"></path>
                                            <path clip-rule="evenodd"
                                                d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z"
                                                fill-rule="evenodd"></path>
                                        </g>
                                    </svg>
                                    <span class="lable"></span>
                                </button>
                            </td>
                            <td><button class="buttons" onclick="enviarBodega(${equipo.cod_equipo})">
                                    <svg class="svg-icon" width="24" viewBox="0 0 24 24" height="24" fill="none">
                                        <g stroke-width="2" stroke-linecap="round" stroke="#056dfa" fill-rule="evenodd" clip-rule="evenodd">
                                            <path d="m3 7h17c.5523 0 1 .44772 1 1v11c0 .5523-.4477 1-1 1h-16c-.55228 0-1-.4477-1-1z"></path>
                                            <path d="m3 4.5c0-.27614.22386-.5.5-.5h6.29289c.13261 0 .25981.05268.35351.14645l2.8536 2.85355h-10z">
                                            </path>
                                        </g>
                                    </svg>
                                    <span class="lable"></span>
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

        const response = await fetch(`http://localhost:3000/tics/enviar/${codEquipo}`, {
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
            console.log('Equipo editado correctamente');
            mostrarMensaje('Equipo editado correctamente', 3000);
            mostrarContenidoTabla();
        } else {
            console.error('Error al editar equipo:', data.message);
        }
    } catch (error) {
        console.error('Error al editar equipooo:', error);
    }
}

// MOSTRA MENSAJE DURANTE Nseg
function mostrarMensaje(mensaje, duracion) {
    const div = document.createElement('div');
    div.textContent = mensaje;
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    div.style.color = 'white';
    div.style.padding = '20px';
    div.style.borderRadius = '10px';
    div.style.zIndex = '9999';
    document.body.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, duracion);
}

function setearFechaActual() {
    const inputFecha = document.getElementById('fechaActual');
    const fechaActual = new Date().toISOString().split('T')[0];
    inputFecha.value = fechaActual;
}

document.addEventListener('DOMContentLoaded', async () => {
    await mostrarContenidoTabla();
    setearFechaActual();
});

