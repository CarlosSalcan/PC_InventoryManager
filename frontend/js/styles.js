//-------------------------------> MENU RESPONSIVE
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

  toggle.addEventListener('click', () => {
    // Add show-menu class to nav menu
    nav.classList.toggle('show-menu')

    // Add show-icon to show and hide the menu icon
    toggle.classList.toggle('show-icon')
  })
}

//-------------------------------> VENTANA EMERGENTE
function mostrarVentanaEmergente(idModal) {
  var modal = document.getElementById(idModal);
  modal.style.display = "block";

  // Cerrar con click afuera de la ventana
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

function cerrarVentanaEmergente(idModal) {
  var modal = document.getElementById(idModal);
  modal.style.display = "none";
}

//-------------------------------> MENSAJE DURANTE Nseg
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
    window.location.reload()
  }, duracion);
}
