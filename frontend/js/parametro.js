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
                            <td><button class="edit-btn" onclick="mostrarVentanaEdit('modal2', '${parametro[campoCodigo]}', '${parametro[campoNombre]}','${tabla}', '${campoNombre}')">
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
        case 'procesador':
            document.getElementById('tabla5').style.display = 'block';
            mostrarParametros('param_procesador', 'cod_proce', 'nom_proce', 'searchProce');
            break;
        case 'servicios':
            document.getElementById('tabla6').style.display = 'block';
            mostrarParametros('param_servicio', 'cod_servicio', 'nom_servicio', 'searchServDep');
            break;
        case 'sisOpe':
            document.getElementById('tabla7').style.display = 'block';
            mostrarParametros('param_sis_ope', 'cod_sis_ope', 'nom_sis_ope', 'searchSisOpe');
            break;
        case 'disco':
            document.getElementById('tabla8').style.display = 'block';
            mostrarParametros('param_tamano_hdd', 'cod_tam_hdd', 'nom_tam_hdd', 'searchDiscoDuro');
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

function mostrarVentanaEdit(modalId, codigo, nombre, tabla, campo) {
    document.getElementById('codigo').textContent = codigo;
    document.getElementById('nombreActual').textContent = nombre;
    document.getElementById('tablaMostrada').textContent = tabla;
    document.getElementById('campoMostrado').textContent = campo;
    // Mostrar la ventana emergente
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
