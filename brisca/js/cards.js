/* cards.js — Datos puros de la baraja española. Sin lógica de juego, sin DOM. */
(function () {

const PALOS = ['oros', 'copas', 'espadas', 'bastos'];

const NOMBRES_PALO = {
  oros: 'Oros',
  copas: 'Copas',
  espadas: 'Espadas',
  bastos: 'Bastos'
};

const VALORES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

const NOMBRES_VALOR = {
  1: 'A', 2: '2', 3: '3', 4: '4', 5: '5',
  6: '6', 7: '7', 10: 'S', 11: 'C', 12: 'R'
};

const PUNTOS_VALOR = {
  1: 11, 2: 0, 3: 10, 4: 0, 5: 0,
  6: 0, 7: 0, 10: 2, 11: 3, 12: 4
};

// De más fuerte a más débil para ganar una baza.
const ORDEN_FUERZA = [1, 3, 12, 11, 10, 7, 6, 5, 4, 2];

function crearMazo() {
  const mazo = [];
  for (const palo of PALOS) {
    for (const valor of VALORES) {
      mazo.push({ palo, valor });
    }
  }
  return mazo;
}

function barajar(mazo) {
  const copia = [...mazo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function getPuntos(carta) {
  return PUNTOS_VALOR[carta.valor];
}

function getFuerza(carta) {
  return ORDEN_FUERZA.length - ORDEN_FUERZA.indexOf(carta.valor);
}

function nombreCarta(carta) {
  return `${NOMBRES_VALOR[carta.valor]} de ${NOMBRES_PALO[carta.palo]}`;
}

window.Cards = {
  PALOS,
  NOMBRES_PALO,
  VALORES,
  NOMBRES_VALOR,
  PUNTOS_VALOR,
  ORDEN_FUERZA,
  crearMazo,
  barajar,
  getPuntos,
  getFuerza,
  nombreCarta
};

})();
