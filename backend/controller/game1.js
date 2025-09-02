// 1. IMPORTAMOS LAS CLASES QUE NECESITAMOS
import { Pelota, Paleta, Marcador } from "./objects.js";
// 2. CONFIGURACIÓN INICIAL DEL JUEGO
const canvas = document.getElementById("canvas-pong");
const contexto = canvas.getContext("2d");
const VELOCIDAD_INICIAL_PELOTA = 5;
const pantallaFinal = document.getElementById("pantalla-final");
const textoGanador = document.getElementById("texto-ganador");
const textoPuntaje = document.getElementById("texto-puntaje");
const botonMostrarGuardar = document.getElementById("boton-mostrar-guardar");
const menuGuardarPuntuacion = document.getElementById(
  "menu-guardar-puntuacion"
);
const inputNombre = document.getElementById("input-nombre");
const botonGuardarFinal = document.getElementById("boton-guardar-final");
const botonCancelarGuardar = document.getElementById("boton-cancelar-guardar");
let gameOver = false;
const pelota = new Pelota(canvas.width / 2, canvas.height / 2, 10, "white");
const paletaJugador = new Paleta(10, canvas.height / 2 - 50, 20, 100, "white");
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
botonMostrarGuardar.addEventListener("click", () => {
  pantallaFinal.classList.add("hidden");
  menuGuardarPuntuacion.classList.remove("hidden");
  botonMostrarGuardar.classList.add("hidden");
});

botonCancelarGuardar.addEventListener("click", () => {
  menuGuardarPuntuacion.classList.add("hidden");
  pantallaFinal.classList.remove("hidden");
});
botonGuardarFinal.addEventListener("click", async () => {
  const nombre = inputNombre.value.trim();
  const puntuacion = marcador.rebotes;
  if (!nombre) {
    alert("Por favor, ingresa un nombre.");
    return;
  }
  menuGuardarPuntuacion.classList.add("hidden");
  pantallaFinal.classList.remove("hidden");
  fetch("/api/ranking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre, puntuacion }),
  });
});
// 4. LÓGICA DE MOVIMIENTO Y COLISIONES
function reiniciarPelota() {
  pelota.x = canvas.width / 2;
  pelota.y = canvas.height / 2;
  pelota.velocidadX = VELOCIDAD_INICIAL_PELOTA;
  pelota.velocidadY = VELOCIDAD_INICIAL_PELOTA;
}
function mostrarPantallaFinal() {
  gameOver = true;
  textoGanador.textContent = "¡JUEGO TERMINADO!";
  textoPuntaje.textContent = `Rebotes: ${marcador.rebotes}`;
  if (marcador.rebotes >= 1) {
    botonMostrarGuardar.classList.remove("hidden");
  }

  pantallaFinal.classList.remove("hidden");
}
function actualizar() {
  if (gameOver) return;
  if ((teclas.w || teclas.ArrowUp) && paletaJugador.y > 0) {
    paletaJugador.moverArriba();
  }
  if (
    (teclas.s || teclas.ArrowDown) &&
    paletaJugador.y < canvas.height - paletaJugador.alto
  ) {
    paletaJugador.moverAbajo();
  }
  pelota.mover();
  if (pelota.y - pelota.radio < 0 || pelota.y + pelota.radio > canvas.height) {
    pelota.velocidadY *= -1;
  }
  if (pelota.x + pelota.radio > canvas.width) {
    pelota.velocidadX *= -1;
  }
  if (
    pelota.x - pelota.radio < paletaJugador.x + paletaJugador.ancho &&
    pelota.y > paletaJugador.y &&
    pelota.y < paletaJugador.y + paletaJugador.alto &&
    pelota.velocidadX < 0
  ) {
    pelota.velocidadX *= -1.05;
    pelota.velocidadY *= 1.02;
    marcador.rebotes++;
  }
  if (pelota.x + pelota.radio < 0) {
    mostrarPantallaFinal();
  }
  // 5. DIBUJAR TODO EN PANTALLA
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  contexto.fillStyle = "white";
  contexto.fillRect(0, 0, canvas.width, 5);
  contexto.fillRect(0, canvas.height - 5, canvas.width, 5);
  contexto.fillRect(canvas.width - 5, 0, 5, canvas.height);
  pelota.dibujar(contexto);
  paletaJugador.dibujar(contexto);
  marcador.dibujarPVE(contexto);
  requestAnimationFrame(actualizar);
}
export function iniciarPVE() {
  console.log("Iniciando modo PvE...");
  reiniciarPelota();
  actualizar();
}
