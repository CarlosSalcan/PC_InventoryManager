async function mostrarParametros(tabla, campoCodigo, campoNombre) {
    try {
        const response = await fetch(`http://localhost:3000/tics/parametros/${tabla}`);
        const data = await response.json();

        if (data.success) {
            const parametros = data.parametros;
            let html = '';

            parametros.forEach((parametro) => {
                html += `<tr>
                            <td>${parametro[campoCodigo]}</td>
                            <td>${parametro[campoNombre]}</td>
                            <td><button type="button">Editar</button></td>
                            <td><button type="button">Borrar</button></td>
                        </tr>`;
            });

            // Inserta la tabla de parámetros en el elemento con ID "searchParam"
            document.getElementById('searchParam').innerHTML = `<table>${html}</table>`;
        } else {
            document.getElementById('searchParam').innerHTML = `<p>No se encontraron parámetros para la tabla ${tabla}.</p>`;
        }
    } catch (error) {
        // Maneja los errores de la solicitud
        document.getElementById('searchParam').innerHTML = '<p>Ocurrió un error al cargar los parámetros.</p>';
        console.error('Error al cargar los parámetros:', error);
    }
}

// Llama a la función mostrarParametros cuando se cargue la página
window.onload = function () {
    //mostrarParametros('param_office', 'cod_office', 'nom_office');
    mostrarParametros('param_procesador', 'cod_proce', 'nom_proce');
};
