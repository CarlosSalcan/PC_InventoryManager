async function mostrarContenidoTabla() {
    try {
        const response = await fetch(`http://localhost:3000/tics/equipos`);
        const data = await response.json();

        if (data.success) {
            const equipos = data.equipos;
            let html = '<table>';
            html += '<thead><tr><th>#</th><th>Fecha</th><th>Codigo de Almacen</th><th>Tipo Equipo</th><th>Ubicacion</th><th>Departamento</th><th>Titular</th><th>Tecnico</th><th>Editar</th><th>Guardar</th></tr></thead>';
            html += '<tbody>';
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
                            <td><button id="openModalBtn" onclick="mostrarVentanaEmergente(),enviarCod(${equipo.cod_equipo}),obtenerDatosEquipo(${equipo.cod_equipo})">Editar</button></td>
                            <td><button onclick="enviarBodega(${equipo.cod_equipo})">Bodega</button></td>
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

// ++ ENVIAR A BODEGA ++
async function enviarBodega(codEquipo) {
    try {
        const response = await fetch(`http://localhost:3000/tics/editar/${codEquipo}`, {
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
            // Actualizar la tabla después de la edición
            mostrarContenidoTabla();
        } else {
            console.error('Error al editar equipo:', data.message);
        }
    } catch (error) {
        console.error('Error al editar equipooo:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await mostrarContenidoTabla();
});