/* game.js — La Brisca, versión de un solo archivo. */
(function () {

const PALOS = ['oros', 'copas', 'espadas', 'bastos'];
const VALORES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const NOMBRES_VALOR = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 10: 'S', 11: 'C', 12: 'R' };
const PUNTOS_VALOR = { 1: 11, 2: 0, 3: 10, 4: 0, 5: 0, 6: 0, 7: 0, 10: 2, 11: 3, 12: 4 };
const ORDEN_FUERZA = [1, 3, 12, 11, 10, 7, 6, 5, 4, 2];

function crearMazo() {
  const mazo = [];
  for (const palo of PALOS) {
    for (const valor of VALORES) mazo.push({ palo, valor });
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

const getPuntos = carta => PUNTOS_VALOR[carta.valor];
const getFuerza = carta => ORDEN_FUERZA.length - ORDEN_FUERZA.indexOf(carta.valor);
const nombreCarta = carta => `${NOMBRES_VALOR[carta.valor]} de ${palabraPalo(carta.palo)}`;
const palabraPalo = palo => palo.charAt(0).toUpperCase() + palo.slice(1);

function segundaGana(primera, segunda, triunfo) {
  const primeraEsTriunfo = primera.palo === triunfo.palo;
  const segundaEsTriunfo = segunda.palo === triunfo.palo;
  if (segundaEsTriunfo && !primeraEsTriunfo) return true;
  if (primeraEsTriunfo && !segundaEsTriunfo) return false;
  if (primera.palo === segunda.palo) return getFuerza(segunda) > getFuerza(primera);
  return false;
}

const estado = {
  mazo: [],
  triunfo: null,
  manoJugador: [],
  manoMaquina: [],
  cartaLider: null,
  lider: 'jugador',
  puntosJugador: 0,
  puntosMaquina: 0,
  jugando: false,
  ultimoResultado: null
};

function elegirLiderMaquina() {
  const sinTriunfo = estado.manoMaquina.filter(c => c.palo !== estado.triunfo.palo);
  const pool = sinTriunfo.length ? sinTriunfo : estado.manoMaquina;
  return [...pool].sort((a, b) => getPuntos(a) - getPuntos(b) || getFuerza(a) - getFuerza(b))[0];
}

function elegirSeguidorMaquina(cartaLider) {
  const mano = estado.manoMaquina;
  const ganadoras = mano.filter(c => segundaGana(cartaLider, c, estado.triunfo));
  if (ganadoras.length) {
    const sinTriunfo = ganadoras.filter(c => c.palo !== estado.triunfo.palo);
    const candidatas = sinTriunfo.length ? sinTriunfo : ganadoras;
    candidatas.sort((a, b) => getFuerza(a) - getFuerza(b));
    return candidatas[0];
  }
  return [...mano].sort((a, b) => getPuntos(a) - getPuntos(b) || getFuerza(a) - getFuerza(b))[0];
}

function iniciarPartida() {
  const mazo = barajar(crearMazo());
  estado.manoJugador = mazo.splice(0, 3);
  estado.manoMaquina = mazo.splice(0, 3);
  estado.triunfo = mazo.shift();
  mazo.push(estado.triunfo);

  estado.mazo = mazo;
  estado.puntosJugador = 0;
  estado.puntosMaquina = 0;
  estado.lider = 'jugador';
  estado.cartaLider = null;
  estado.ultimoResultado = null;
  estado.jugando = true;

  mostrarPantalla('juego');
  render();
  mostrarMensaje(`Triunfo: ${nombreCarta(estado.triunfo)}. Tu turno.`);
}

function jugarCartaJugador(indice) {
  if (!estado.jugando) return;
  const carta = estado.manoJugador[indice];
  if (!carta) return;

  if (!estado.cartaLider) {
    estado.manoJugador.splice(indice, 1);
    estado.cartaLider = { de: 'jugador', carta };
    render();
    mostrarMensaje('Esperando a la máquina...');
    setTimeout(turnoMaquinaSigue, 700);
  } else if (estado.cartaLider.de === 'maquina') {
    estado.manoJugador.splice(indice, 1);
    resolverBaza({ de: 'jugador', carta });
  }
}

function turnoMaquinaLidera() {
  if (!estado.jugando) return;
  const carta = elegirLiderMaquina();
  estado.manoMaquina.splice(estado.manoMaquina.indexOf(carta), 1);
  estado.cartaLider = { de: 'maquina', carta };
  render();
  mostrarMensaje('La máquina abrió la baza. Elige tu carta.');
}

function turnoMaquinaSigue() {
  if (!estado.jugando) return;
  const carta = elegirSeguidorMaquina(estado.cartaLider.carta);
  estado.manoMaquina.splice(estado.manoMaquina.indexOf(carta), 1);
  resolverBaza({ de: 'maquina', carta });
}

function resolverBaza(segundaJugada) {
  const primera = estado.cartaLider;
  const segunda = segundaJugada;
  const ganaSegunda = segundaGana(primera.carta, segunda.carta, estado.triunfo);
  const ganador = ganaSegunda ? segunda.de : primera.de;
  const puntosBaza = getPuntos(primera.carta) + getPuntos(segunda.carta);

  if (ganador === 'jugador') estado.puntosJugador += puntosBaza;
  else estado.puntosMaquina += puntosBaza;

  estado.ultimoResultado = {
    ganador,
    puntosBaza,
    cartaJugador: primera.de === 'jugador' ? primera.carta : segunda.carta,
    cartaMaquina: primera.de === 'maquina' ? primera.carta : segunda.carta
  };

  robarCartas(ganador);
  estado.lider = ganador;
  estado.cartaLider = null;

  render();
  const quien = ganador === 'jugador' ? 'Tú ganas' : 'La máquina gana';
  mostrarMensaje(puntosBaza > 0 ? `${quien} la baza (+${puntosBaza} puntos)` : `${quien} la baza (sin puntos)`);

  if (estado.manoJugador.length === 0 && estado.manoMaquina.length === 0) {
    setTimeout(terminarPartida, 1200);
    return;
  }
  if (estado.lider === 'maquina') setTimeout(turnoMaquinaLidera, 1300);
}

function robarCartas(ganador) {
  const orden = ganador === 'jugador' ? ['jugador', 'maquina'] : ['maquina', 'jugador'];
  for (const quien of orden) {
    if (estado.mazo.length === 0) continue;
    const carta = estado.mazo.shift();
    if (quien === 'jugador') estado.manoJugador.push(carta);
    else estado.manoMaquina.push(carta);
  }
}

function terminarPartida() {
  estado.jugando = false;
  let resultado = 'Empate';
  if (estado.puntosJugador > estado.puntosMaquina) resultado = '¡Ganaste!';
  else if (estado.puntosMaquina > estado.puntosJugador) resultado = 'Perdiste';

  document.getElementById('fin-titulo').textContent = resultado;
  document.getElementById('fin-detalle').textContent =
    `Tú: ${estado.puntosJugador} puntos · Máquina: ${estado.puntosMaquina} puntos`;
  mostrarPantalla('fin');
}

/* ---------- DOM ---------- */

const pantallas = {
  inicio: document.getElementById('pantalla-inicio'),
  juego: document.getElementById('pantalla-juego'),
  fin: document.getElementById('pantalla-fin')
};

function mostrarPantalla(nombre) {
  Object.values(pantallas).forEach(p => p.classList.add('oculta'));
  pantallas[nombre].classList.remove('oculta');
}

function crearCartaHTML(carta, jugable) {
  const etiqueta = `${NOMBRES_VALOR[carta.valor]}${simboloPalo(carta.palo)}`;
  const clase = `carta carta-${carta.palo}${jugable ? ' jugable' : ''}`;
  return `<div class="${clase}" title="${nombreCarta(carta)}">${etiqueta}</div>`;
}

function simboloPalo(palo) {
  return { oros: '🪙', copas: '🏆', espadas: '⚔️', bastos: '🌳' }[palo];
}

function render() {
  document.getElementById('puntos-jugador').textContent = estado.puntosJugador;
  document.getElementById('puntos-maquina').textContent = estado.puntosMaquina;
  document.getElementById('mazo-contador').textContent = estado.mazo.length;
  document.getElementById('triunfo').textContent = estado.triunfo ? nombreCarta(estado.triunfo) : '';

  const manoMaquinaEl = document.getElementById('mano-maquina');
  manoMaquinaEl.innerHTML = estado.manoMaquina.map(() => '<div class="carta carta-dorso"></div>').join('');

  const manoJugadorEl = document.getElementById('mano-jugador');
  const puedeJugar = estado.jugando && (!estado.cartaLider || estado.cartaLider.de === 'maquina');
  manoJugadorEl.innerHTML = estado.manoJugador
    .map((carta, i) => crearCartaHTML(carta, puedeJugar).replace('class="carta', `data-indice="${i}" class="carta`))
    .join('');
  if (puedeJugar) {
    manoJugadorEl.querySelectorAll('.jugable').forEach(elCarta => {
      elCarta.addEventListener('click', () => jugarCartaJugador(Number(elCarta.dataset.indice)));
    });
  }

  const jugadaJugadorEl = document.getElementById('carta-jugada-jugador');
  jugadaJugadorEl.innerHTML = estado.cartaLider && estado.cartaLider.de === 'jugador'
    ? crearCartaHTML(estado.cartaLider.carta, false)
    : (estado.ultimoResultado ? crearCartaHTML(estado.ultimoResultado.cartaJugador, false) : '');

  const jugadaMaquinaEl = document.getElementById('carta-jugada-maquina');
  jugadaMaquinaEl.innerHTML = estado.cartaLider && estado.cartaLider.de === 'maquina'
    ? crearCartaHTML(estado.cartaLider.carta, false)
    : (estado.ultimoResultado && !estado.cartaLider ? crearCartaHTML(estado.ultimoResultado.cartaMaquina, false) : '');
}

function mostrarMensaje(texto) {
  document.getElementById('mensaje').textContent = texto;
}

document.getElementById('btn-jugar').addEventListener('click', iniciarPartida);
document.getElementById('btn-jugar-de-nuevo').addEventListener('click', iniciarPartida);

mostrarPantalla('inicio');

})();
