//-------------------------------> Menu Sidebar
const cloud = document.getElementById("cloud");
const barraLateral = document.querySelector(".barra-lateral");
const spans = document.querySelectorAll("span");
const palanca = document.querySelector(".switch");
const circulo = document.querySelector(".circulo");
const menu = document.querySelector(".menu");
const main = document.querySelector("main");

menu.addEventListener("click",()=>{
    barraLateral.classList.toggle("max-barra-lateral");
    if(barraLateral.classList.contains("max-barra-lateral")){
        menu.children[0].style.display = "none";
        menu.children[1].style.display = "block";
    }
    else{
        menu.children[0].style.display = "block";
        menu.children[1].style.display = "none";
    }
    if(window.innerWidth<=320){
        barraLateral.classList.add("mini-barra-lateral");
        main.classList.add("min-main");
        spans.forEach((span)=>{
            span.classList.add("oculto");
        })
    }
});

palanca.addEventListener("click",()=>{
    let body = document.body;
    body.classList.toggle("dark-mode");
    body.classList.toggle("");
    circulo.classList.toggle("prendido");
});

cloud.addEventListener("click",()=>{
    barraLateral.classList.toggle("mini-barra-lateral");
    main.classList.toggle("min-main");
    spans.forEach((span)=>{
        span.classList.toggle("oculto");
    });
});

//-------------------------------> Ventana Emergente
function mostrarVentanaEmergente(idModal) {
  var modal = document.getElementById(idModal);
  modal.style.display = "block";
}

function cerrarVentanaEmergente(idModal) {
  var modal = document.getElementById(idModal);
  modal.style.display = "none";
}

//-------------------------------> Mensaje durante nseg
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
