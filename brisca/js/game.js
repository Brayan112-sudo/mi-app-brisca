/* game.js — Reglas y lógica de la Brisca. Nunca toca el DOM: delega en UI. */
(function () {

const { crearMazo, barajar, getPuntos, getFuerza, nombreCarta } = window.Cards;

const estado = {
  mazo: [],
  triunfo: null,
  manoJugador: [],
  manoMaquina: [],
  cartaLider: null,   // { de: 'jugador' | 'maquina', carta }
  lider: 'jugador',   // quién debe abrir la próxima baza
  puntosJugador: 0,
  puntosMaquina: 0,
  nombreJugador: 'Jugador',
  jugando: false,
  ultimoResultado: null
};

/* ---------- Reglas de la baza ---------- */

function segundaGana(primera, segunda, triunfo) {
  const primeraEsTriunfo = primera.palo === triunfo.palo;
  const segundaEsTriunfo = segunda.palo === triunfo.palo;

  if (segundaEsTriunfo && !primeraEsTriunfo) return true;
  if (primeraEsTriunfo && !segundaEsTriunfo) return false;
  if (primeraEsTriunfo && segundaEsTriunfo) {
    return getFuerza(segunda) > getFuerza(primera);
  }
  if (primera.palo === segunda.palo) {
    return getFuerza(segunda) > getFuerza(primera);
  }
  return false; // distinto palo, ninguna es triunfo: gana quien abrió
}

/* ---------- Inteligencia de la máquina ---------- */

const IA = {
  elegirLider(mano, triunfo) {
    const sinTriunfo = mano.filter(c => c.palo !== triunfo.palo);
    const pool = sinTriunfo.length ? sinTriunfo : mano;
    const ordenada = [...pool].sort(
      (a, b) => getPuntos(a) - getPuntos(b) || getFuerza(a) - getFuerza(b)
    );
    return ordenada[0];
  },

  elegirSeguidor(mano, cartaLider, triunfo) {
    const ganadoras = mano.filter(c => segundaGana(cartaLider, c, triunfo));
    if (ganadoras.length) {
      const puntosEnJuego = getPuntos(cartaLider);
      const sinTriunfo = ganadoras.filter(c => c.palo !== triunfo.palo);
      const candidatas = sinTriunfo.length ? sinTriunfo : ganadoras;
      candidatas.sort((a, b) => getFuerza(a) - getFuerza(b));
      // Si la baza no vale puntos y solo se puede ganar con triunfo caro, mejor no gastarlo.
      if (puntosEnJuego === 0 && candidatas === ganadoras && ganadoras.every(c => c.palo === triunfo.palo)) {
        const barata = [...mano].sort((a, b) => getPuntos(a) - getPuntos(b) || getFuerza(a) - getFuerza(b));
        if (getPuntos(barata[0]) === 0) return barata[0];
      }
      return candidatas[0];
    }
    const ordenada = [...mano].sort(
      (a, b) => getPuntos(a) - getPuntos(b) || getFuerza(a) - getFuerza(b)
    );
    return ordenada[0];
  }
};

/* ---------- Flujo de partida ---------- */

function iniciarPartida(nombre) {
  estado.nombreJugador = (nombre || 'Jugador').trim().slice(0, 20) || 'Jugador';
  const mazo = barajar(crearMazo());

  estado.manoJugador = mazo.splice(0, 3);
  estado.manoMaquina = mazo.splice(0, 3);
  estado.triunfo = mazo.shift();
  mazo.push(estado.triunfo); // se roba como última carta del mazo

  estado.mazo = mazo;
  estado.puntosJugador = 0;
  estado.puntosMaquina = 0;
  estado.lider = 'jugador';
  estado.cartaLider = null;
  estado.ultimoResultado = null;
  estado.jugando = true;

  window.UI.renderTodo(estado);
  window.UI.mostrarMensaje(`¡Reparto listo! Triunfo: ${nombreCarta(estado.triunfo)}. Tu turno.`);

  if (estado.lider === 'maquina') {
    setTimeout(turnoMaquinaLidera, 700);
  }
}

function jugarCartaJugador(indice) {
  if (!estado.jugando) return;
  const carta = estado.manoJugador[indice];
  if (!carta) return;

  if (!estado.cartaLider) {
    // El jugador abre la baza.
    estado.manoJugador.splice(indice, 1);
    estado.cartaLider = { de: 'jugador', carta };
    window.UI.renderTodo(estado);
    window.UI.mostrarMensaje('Esperando a la máquina...');
    setTimeout(turnoMaquinaSigue, 700);
  } else if (estado.cartaLider.de === 'maquina') {
    // El jugador responde a la máquina.
    estado.manoJugador.splice(indice, 1);
    resolverBaza({ de: 'jugador', carta });
  }
}

function turnoMaquinaLidera() {
  if (!estado.jugando) return;
  const carta = IA.elegirLider(estado.manoMaquina, estado.triunfo);
  estado.manoMaquina.splice(estado.manoMaquina.indexOf(carta), 1);
  estado.cartaLider = { de: 'maquina', carta };
  window.UI.renderTodo(estado);
  window.UI.mostrarMensaje('La máquina abrió la baza. Elige tu carta.');
}

function turnoMaquinaSigue() {
  if (!estado.jugando) return;
  const carta = IA.elegirSeguidor(estado.manoMaquina, estado.cartaLider.carta, estado.triunfo);
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

  window.UI.renderTodo(estado);
  window.UI.mostrarResultadoBaza(estado.ultimoResultado, estado.nombreJugador);

  if (estado.manoJugador.length === 0 && estado.manoMaquina.length === 0) {
    setTimeout(terminarPartida, 1200);
    return;
  }

  if (estado.lider === 'maquina') {
    setTimeout(turnoMaquinaLidera, 1300);
  }
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
  let resultado = 'empate';
  if (estado.puntosJugador > estado.puntosMaquina) resultado = 'ganaste';
  else if (estado.puntosMaquina > estado.puntosJugador) resultado = 'perdiste';

  const { ranking } = window.Storage.guardarPuntaje({
    nombre: estado.nombreJugador,
    puntos: estado.puntosJugador,
    resultado
  });

  window.UI.mostrarPantallaFin(estado, resultado, ranking);
}

window.Game = {
  estado,
  iniciarPartida,
  jugarCartaJugador
};

})();
