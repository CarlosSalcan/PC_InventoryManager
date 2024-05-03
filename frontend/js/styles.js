let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e) => {
    let arrowParent = e.target.parentElement.parentElement;
    arrowParent.classList.toggle("showMenu");
  });
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

// Mostrar Ventana Emergente
function mostrarVentanaEmergente(idModal) {
  var modal = document.getElementById(idModal);
  modal.style.display = "block";
}

// Cerrar Ventana Emergente
function cerrarVentanaEmergente(idModal) {
  var modal = document.getElementById(idModal);
  modal.style.display = "none";
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
      window.location.reload()
  }, duracion);
}
