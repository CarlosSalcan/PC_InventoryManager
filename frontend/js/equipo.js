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
                            <td><button class="button" id="openModalBtn" onclick="mostrarVentanaEmergente('modal1')">
                                    <svg height="1em" viewBox="0 0 512 512">
                                        <path
                                        d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                                        ></path>
                                    </svg>
                                </button>                       
                            </td>
                            <td><button class="buttons" onclick="enviarBodega(${equipo.cod_equipo})">
                                    <div class="svgWrapper">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 42 42" class="svgIcon" width="20" height="20">
                                            <path stroke-width="5" stroke="#fff"
                                                d="M9.14073 2.5H32.8593C33.3608 2.5 33.8291 2.75065 34.1073 3.16795L39.0801 10.6271C39.3539 11.0378 39.5 11.5203 39.5 12.0139V21V37C39.5 38.3807 38.3807 39.5 37 39.5H5C3.61929 39.5 2.5 38.3807 2.5 37V21V12.0139C2.5 11.5203 2.6461 11.0378 2.91987 10.6271L7.89266 3.16795C8.17086 2.75065 8.63921 2.5 9.14073 2.5Z">
                                            </path>
                                            <rect stroke-width="3" stroke="#fff" rx="2" height="4" width="311" y="18.5" x="15.5"></rect>
                                            <path stroke-width="5" stroke="#fff" d="M1 12L41 12"></path>
                                        </svg>
                                    </div>
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

// function setearFechaActual() {
//     const inputFecha = document.getElementById('fechaActual');
//     const fechaActual = new Date().toISOString().split('T')[0];
//     inputFecha.value = fechaActual;
// }

document.addEventListener('DOMContentLoaded', async () => {
    await mostrarContenidoTabla();
});

