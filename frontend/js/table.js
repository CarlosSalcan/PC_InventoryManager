async function mostrarContenidoTabla() {
    try {
        const response = await fetch(`http://localhost:3000/tics/equipos`);
        const data = await response.json();

        if (data.success) {
            const equipos = data.equipos;
            let html = '<h2>Contenido de la tabla:</h2>';
            html += '<table>';
            html += '<thead><tr><th>#</th><th>Fecha</th><th>Codigo de Almacen</th><th>Tipo Equipo</th><th>Ubicacion</th><th>Departamento</th><th>Titular</th><th>Tecnico</th><th>Guardar</th></tr></thead>';
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
                            <td><button onclick="">Bodega</button></td>
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