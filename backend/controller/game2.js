// 1. IMPORTAMOS LAS CLASES QUE NECESITAMOS
import { Pelota, Paleta, Marcador } from "./objects.js";
// 2. CONFIGURACIÓN INICIAL DEL JUEGO
const canvas = document.getElementById("canvas-pong");
const contexto = canvas.getContext("2d");
const VELOCIDAD_INICIAL_PELOTA = 5;
const PUNTOS_PARA_GANAR = 10;
const pantallaFinal = document.getElementById("pantalla-final");
const textoGanador = document.getElementById("texto-ganador");
let gameOver = false;
const pelota = new Pelota(canvas.width / 2, canvas.height / 2, 10, "white");
const paletaIzquierda = new Paleta(
  10,
  canvas.height / 2 - 50,
  20,
  100,
  "white"
);
const paletaDerecha = new Paleta(
  canvas.width - 30,
  canvas.height / 2 - 50,
  20,
  100,
  "white"
);
const marcador = new Marcador(canvas.width / 2, 50, "white");
// 3. MANEJO DE TECLADO
const teclas = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};
window.addEventListener("keydown", (e) => {
  if (e.key in teclas) {
    teclas[e.key] = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key in teclas) {
    teclas[e.key] = false;
  }
});
// 4. LÓGICA DE MOVIMIENTO Y COLISIONES
function reiniciarPelota() {
  pelota.x = canvas.width / 2;
  pelota.y = canvas.height / 2;
  const direccion = Math.sign(pelota.velocidadX);
  pelota.velocidadX = -direccion * VELOCIDAD_INICIAL_PELOTA;
  pelota.velocidadY = VELOCIDAD_INICIAL_PELOTA;
}
function mostrarPantallaFinal(ganador) {
  gameOver = true;
  textoGanador.textContent = `¡GANA EL ${ganador}!`;
  pantallaFinal.classList.remove("hidden");
}
function actualizar() {
  if (gameOver) return;
  if (teclas.w && paletaIzquierda.y > 0) {
    paletaIzquierda.moverArriba();
  }
  if (teclas.s && paletaIzquierda.y < canvas.height - paletaIzquierda.alto) {
    paletaIzquierda.moverAbajo();
  }
  if (teclas.ArrowUp && paletaDerecha.y > 0) {
    paletaDerecha.moverArriba();
  }
  if (
    teclas.ArrowDown &&
    paletaDerecha.y < canvas.height - paletaDerecha.alto
  ) {
    paletaDerecha.moverAbajo();
  }
  pelota.mover();
  if (pelota.y - pelota.radio < 0 || pelota.y + pelota.radio > canvas.height) {
    pelota.velocidadY *= -1;
  }
  if (
    pelota.x - pelota.radio < paletaIzquierda.x + paletaIzquierda.ancho &&
    pelota.y > paletaIzquierda.y &&
    pelota.y < paletaIzquierda.y + paletaIzquierda.alto &&
    pelota.velocidadX < 0
  ) {
    pelota.velocidadX *= -1.05;
    pelota.velocidadY *= 1.02;
  }
  if (
    pelota.x + pelota.radio > paletaDerecha.x &&
    pelota.y > paletaDerecha.y &&
    pelota.y < paletaDerecha.y + paletaDerecha.alto &&
    pelota.velocidadX > 0
  ) {
    pelota.velocidadX *= -1.05;
    pelota.velocidadY *= 1.02;
  }
  if (pelota.x - pelota.radio < 0) {
    marcador.puntuacion2++;
    if (marcador.puntuacion2 >= PUNTOS_PARA_GANAR) {
      mostrarPantallaFinal("JUGADOR 2");
    } else {
      reiniciarPelota();
    }
  } else if (pelota.x + pelota.radio > canvas.width) {
    marcador.puntuacion1++;
    if (marcador.puntuacion1 >= PUNTOS_PARA_GANAR) {
      mostrarPantallaFinal("JUGADOR 1");
    } else {
      reiniciarPelota();
    }
  }
  // 5. DIBUJAR TODO EN PANTALLA
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  contexto.fillStyle = "white";
  contexto.fillRect(0, 0, canvas.width, 5);
  contexto.fillRect(0, canvas.height - 5, canvas.width, 5);
  pelota.dibujar(contexto);
  paletaIzquierda.dibujar(contexto);
  paletaDerecha.dibujar(contexto);
  marcador.dibujarPVP(contexto);
  requestAnimationFrame(actualizar);
}
export function iniciarPVP() {
  console.log("Iniciando modo PvP...");
  pelota.velocidadX = VELOCIDAD_INICIAL_PELOTA;
  pelota.velocidadY = VELOCIDAD_INICIAL_PELOTA;
  actualizar();
}
