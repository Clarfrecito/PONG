export class Pelota {
  constructor(x, y, radio, color) {
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.color = color;
    this.velocidadX = 5;
    this.velocidadY = 5;
  }
  dibujar(contexto) {
    contexto.fillStyle = this.color;
    contexto.beginPath();
    contexto.arc(this.x, this.y, this.radio, 0, Math.PI * 2, false);
    contexto.closePath();
    contexto.fill();
  }
  mover() {
    this.x += this.velocidadX;
    this.y += this.velocidadY;
  }
}
export class Paleta {
  constructor(x, y, ancho, alto, color) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.color = color;
    this.velocidad = 10;
  }
  dibujar(contexto) {
    contexto.fillStyle = this.color;
    contexto.fillRect(this.x, this.y, this.ancho, this.alto);
  }
  moverArriba() {
    this.y -= this.velocidad;
  }
  moverAbajo() {
    this.y += this.velocidad;
  }
}
export class Marcador {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.puntuacion1 = 0;
    this.puntuacion2 = 0;
    this.rebotes = 0;
  }
  dibujarPVP(contexto) {
    contexto.fillStyle = this.color;
    contexto.font = "2.5rem 'Workbench'";
    contexto.fillText(this.puntuacion1, this.x - 60, this.y);
    contexto.fillText(this.puntuacion2, this.x + 30, this.y);
  }
  dibujarPVE(contexto) {
    contexto.fillStyle = this.color;
    contexto.font = "2.5rem 'Workbench'";
    contexto.fillText(`${this.rebotes}`, this.x, this.y);
  }
}
