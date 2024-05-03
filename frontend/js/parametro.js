async function mostrarParametros(tabla, campoCodigo, campoNombre, campoMostrar) {
    try {
        const response = await fetch(`http://localhost:3000/tics/parametros/${tabla}`);
        const data = await response.json();

        if (data.success) {
            const parametros = data.parametros;
            let html = '';

            parametros.forEach((parametro) => {
                html += ` 
                        <div id="modal2" class="modal">
                            <div class="modal-content">
                                <span class="close" onclick="cerrarVentanaEmergente('modal2')">&times;</span>
                                <h2>Ventana Emergente 22</h2>

                                <form id="editarParametroForm">
                                    <label for="codigo">Código:</label>
                                    <span id="codigo" name="codigo"></span>
                                
                                    <label for="nombreActual">Nombre Actual:</label>
                                    <span id="nombreActual" name="nombreActual"></span>
                                
                                    <label for="newNombre">Nuevo Nombre:</label>
                                    <input type="text" id="newNombre" name="newNombre" required>
                                
                                    <button type="button" onclick="modificarNombre('${tabla}', '${campoNombre}',document.getElementById('nombreActual').textContent, document.getElementById('newNombre').value)">Guardar</button>
                                </form>
                            </div>
                        </div>                
                        <tr>
                            <td>${parametro[campoCodigo]}</td>
                            <td>${parametro[campoNombre]}</td>
                            <td><button class="button" id="openModalBtn" onclick="mostrarVentanaEdit('modal2', '${parametro[campoCodigo]}', '${parametro[campoNombre]}')">
                                    <svg height="1em" viewBox="0 0 512 512">
                                        <path
                                        d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                                        ></path>
                                    </svg>
                                </button>
                            </td>
                            <td><button class="bin-button" onclick="eliminarParam('${tabla}', '${campoCodigo}', '${parametro[campoCodigo]}', '${parametro[campoNombre]}')" style="padding: 5px;">
                                    <svg class="bin-top" viewBox="0 0 39 7" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 15px;">
                                        <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
                                        <line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line>
                                    </svg>
                                    <svg class="bin-bottom" viewBox="0 0 33 39" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 15px;">
                                        <mask id="path-1-inside-1_8_19" fill="white">
                                            <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                                        </mask>
                                        <path
                                            d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                            fill="white" mask="url(#path-1-inside-1_8_19)"></path>
                                        <path d="M12 6L12 29" stroke="white" stroke-width="3"></path>
                                        <path d="M21 6V29" stroke="white" stroke-width="3"></path>
                                    </svg>
                                </button>
                            </td>
                        </tr>`;
            });

            // Inserta la tabla de parámetros en el elemento con ID "searchParam"
            document.getElementById(campoMostrar).innerHTML = `<table>${html}</table>`;
        } else {
            document.getElementById(campoMostrar).innerHTML = `<p>No se encontraron parámetros para la tabla ${tabla}.</p>`;
        }
    } catch (error) {
        document.getElementById('searchParam').innerHTML = '<p>Ocurrió un error al cargar los parámetros.</p>';
        console.error('Error al cargar los parámetros:', error);
    }
}

async function eliminarParam(tabla, campo, valor, name) {
    try {
        // Mostrar una ventana de confirmación al usuario
        const confirmacion = confirm(`¿ESTA SEGURO DE ELIMINAR EL SIGUIENTE PARAMETRO:
        \u2022 CODIGO: ${valor}
        \u2022 NOMBRE: ${name}`);

        if (confirmacion) {
            const response = await fetch(`http://localhost:3000/tics/borrar/${tabla}/${campo}/${valor}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                console.log('Registro borrado correctamente');

                mostrarMensaje('Parametro Borrado Correctamente', 2500);
            } else {
                console.error('Error al borrar el registro:', data.message);
            }
        }
    } catch (error) {
        console.error('Error al borrar el registro:', error);
    }
}

function mostrarVentanaEdit(modalId, codigo, nombre) {
    const codigoElement = document.getElementById('codigo');
    const nombreElement = document.getElementById('nombreActual');

    codigoElement.textContent = codigo;
    nombreElement.textContent = nombre;

    document.getElementById(modalId).style.display = 'block';
}

async function modificarNombre(tabla, campo, valor, nuevoNombre) {
    try {
        const response = await fetch(`http://localhost:3000/tics/modificarNombre/${tabla}/${campo}/${valor}/${nuevoNombre}`, {
            method: 'PUT'
        });
        const data = await response.json();

        if (data.success) {
            console.log('Nombre del registro modificado correctamente');
            window.location.reload()
        } else {
            console.error('Error al modificar el nombre del registro:', data.message);
            if (data.message === 'El nombre ingresado ya existe en la tabla') {
                alert('El nombre ingresado YA EXISTE en la tabla'); // Mostrar mensaje al usuario
                window.location.reload()
            }
        }
    } catch (error) {
        console.error('Error al editar el nombre del parámetro:', error);
    }
}

// LLAMADO PRINCIPAL A FUNCIONES
window.onload = function () {
    mostrarParametros('param_marcas', 'cod_marcas', 'nom_marcas', 'searchMarcas')
};
