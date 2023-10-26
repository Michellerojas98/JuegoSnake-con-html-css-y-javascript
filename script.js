const tableroJuego = document.querySelector(".tablero-juego");
const puntuacionElement = document.querySelector(".puntuacion");
const mejorPuntuacionElement = document.querySelector(".mejor-puntuacion");
const controles = document.querySelectorAll(".controles i");

let juegoTerminado =  false;
let comidaX, comidaY; 
let cabezaX = 5 ,cabezaY =5;
let velocidadX = 0, velocidadY = 0; 
let cuerpoSerpiente = [];
let intervalosId;
let puntuacion = 0; 

let puntoAudio = document.getElementById("puntoAudio");
let finAudio = document.getElementById("finAudio");

let mejorPuntuacion = localStorage.getItem("mejor-puntuacion") || 0;
mejorPuntuacionElement.innerText = `Mejor Puntuacion: ${mejorPuntuacion}`;

const actualizarPosicionComida = () => {
    comidaX = Math.floor(Math.random() * 30) + 1; 
    comidaY = Math.floor(Math.random() * 30) + 1; 
}

const manejarJuegoTerminado = () => {
    clearInterval(intervalosId);
    finAudio.play();
    alert("Juego terminado Presiona OK para reinciar... ");
    location.reload();
}

const cambiarDireccion = e => {
    if(e.key ===  "ArrowUp" && velocidadY !== 1){
        velocidadX = 0;
        velocidadY = -1; 
    }else if(e.key ===  "ArrowDown" && velocidadY !== -1){
        velocidadX = 0;
        velocidadY = 1;
    }else if(e.key ===  "ArrowLeft" && velocidadX !== 1){
        velocidadX = -1;
        velocidadY = 0;
    }
    else if(e.key ===  "ArrowRight" && velocidadX !== -1){
        velocidadX = 1;
        velocidadY = 0;
    }
}

controles.forEach(boton => boton.addEventListener("click", () => cambiarDireccion({key: boton.dataset.tecla})));

const iniciarJuego = () => {
    if(juegoTerminado) return manejarJuegoTerminado();
    let html = `<div class="comida" style="grid-area: ${comidaY} / ${comidaX}"><img src="./img/dulce.png" alt="dulce"></div>`;
     
    if(cabezaX === comidaX && cabezaY === comidaY){
        actualizarPosicionComida();
        cuerpoSerpiente.push([comidaY, comidaX]);
        puntuacion++; 
        mejorPuntuacion = puntuacion >= mejorPuntuacion ? puntuacion : mejorPuntuacion; 
        localStorage.setItem("mejor-puntuacion", mejorPuntuacion);
        puntuacionElement.innerText = `puntuacion: ${puntuacion}`;
        mejorPuntuacionElement.innerText = `Mejor puntuacion: ${mejorPuntuacion}`;
        puntoAudio.play();
    }
    cabezaX += velocidadX;
    cabezaY += velocidadY;

    for (let i = cuerpoSerpiente.length - 1; i > 0; i--) {
        cuerpoSerpiente[i] = cuerpoSerpiente[i-1];
    
    }
    cuerpoSerpiente[0] = [cabezaX, cabezaY];

    if(cabezaX <= 0 || cabezaX > 30 || cabezaY <= 0 || cabezaY > 30 ){
        juegoTerminado =  true; 
        return;
    }
    for (let i = 0; i < cuerpoSerpiente.length; i++) {
        html += `<div class="cabeza" style="grid-area: ${cuerpoSerpiente[i][1]} / ${cuerpoSerpiente[i][0]}"><img src="./img/ojo.png" alt="ojo"></div>`;
        if(i !== 0 && cuerpoSerpiente[0][1] === cuerpoSerpiente[i][1] && cuerpoSerpiente[0][0] === cuerpoSerpiente[i][0]){
            juegoTerminado =  true;
        }
    }
     tableroJuego.innerHTML = html;

}

actualizarPosicionComida();
intervalosId = setInterval(iniciarJuego, 100); 
document.addEventListener("keyup", cambiarDireccion);