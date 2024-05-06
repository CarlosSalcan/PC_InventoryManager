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
                            <td><button class="copy" onclick="mostrarVentanaEdit('modal2', '${parametro[campoCodigo]}', '${parametro[campoNombre]}')">
                                    <span data-text-end="Copied!" data-text-initial="Editar" class="tooltip"></span>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="edit">
                                            <path fill="currentColor" d="M19.996 2.006c-1.109-.002-2.215.428-3.052 1.267L6.09 13.13a.999.999 0 0 0-.258.437l-1.302 4.672a1 1 0 0 0 1.266 1.267l4.672-1.302a1 1 0 0 0 .437-.258l9.857-9.855A4.29 4.29 0 0 0 22 6.007c0-1.123-.436-2.229-1.004-3.001a4.296 4.296 0 0 0-1.004-1.001zm-2.222 3.224L8.929 16.81l-2.929.816.815-2.929L17.774 4.23l.001.001 1.001-1.001zM7.183 17.816l-2.001.556.556-2 8.03-8.028 1.445 1.444-8.03 8.028-2 0.556.556-2z"/>
                                        </svg>
                                    </span>
                                </button>
                            </td>
                            <td><button class="copy" onclick="eliminarParam('${tabla}', '${campoCodigo}', '${parametro[campoCodigo]}', '${parametro[campoNombre]}')" style="padding: 5px;">
                                    <span data-text-end="Copied!" data-text-initial="Borrar" class="tooltip"></span>
                                    <svg class="bin-top" viewBox="0 0 39 7" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 15px; position: relative; top: -9px; left: 8px">
                                        <line y1="3" x2="35" y2="3" stroke="white" stroke-width="2"></line>
                                        <line x1="13" y1="5" x2="23" y2="5" stroke="white" stroke-width="60" style="font-size: 10px;"></line>
                                    </svg>
                        
                                    <svg class="bin-bottom" viewBox="0 0 35 39" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 10px;">
                                        <mask id="path-1-inside-1_8_19" fill="white">
                                            <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                                        </mask>
                                        <path
                                            d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                            fill="white" mask="url(#path-1-inside-1_8_19)"></path>
                                        <path d="M12 6L12 29" stroke="white" stroke-width="5"></path>
                                        <path d="M21 6V29" stroke="white" stroke-width="5"></path>
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

                mostrarMensaje('Parametro Borrado Correctamente', 2000);
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
