async function mostrarParametros(tabla, campoCodigo, campoNombre, campoMostrar) {
    try {
        const response = await fetch(`http://localhost:3000/tics/parametros/${tabla}`);
        const data = await response.json();

        if (data.success) {
            const parametros = data.parametros;
            let html = '';

            parametros.forEach((parametro) => {
                html += `            
                        <tr>
                            <td>${parametro[campoCodigo]}</td>
                            <td>${parametro[campoNombre]}</td>
                            <td><button class="edit-btn" onclick="mostrarVentanaEdit('modal2', '${parametro[campoCodigo]}', '${parametro[campoNombre]}')">
                                    Editar
                                </button>
                            </td>
                            <td><button class="edit-btn" onclick="eliminarParam('${tabla}', '${campoCodigo}', '${parametro[campoCodigo]}', '${parametro[campoNombre]}')">
                                    Borrar
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
        document.getElementById(campoMostrar).innerHTML = '<p>Ocurrió un error al cargar los parámetros.</p>';
        console.error('Error al cargar los parámetros:', error);
    }
}


function mostrarFormularios(formulario) {
    const forms = document.querySelectorAll('.parametros');
    forms.forEach(form => form.style.display = 'none');

    switch (formulario) {
        case 'antivirus':
            document.getElementById('tabla1').style.display = 'block';
            mostrarParametros('param_antivirus', 'cod_antivirus', 'nom_antivirus', 'searchAntivirus');
            break;
        case 'marcas':
            document.getElementById('tabla2').style.display = 'block';
            mostrarParametros('param_marcas', 'cod_marcas', 'nom_marcas', 'searchMarcas');
            break;
        case 'memoria_ram':
            document.getElementById('tabla3').style.display = 'block';
            mostrarParametros('param_memoria', 'cod_memoria', 'nom_memoria', 'searchMemoriaRam');
            break;
        case 'office':
            document.getElementById('tabla4').style.display = 'block';
            mostrarParametros('param_office', 'cod_office', 'nom_office', 'searchOffice');
            break;
        default:
            break;
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
    mostrarParametros('param_marcas', 'cod_marcas', 'nom_marcas', 'searchAntivirus')
};


/* <div id="modal2" class="modal">
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
                        </div> */
