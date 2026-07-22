/* game.js - La Brisca */
(function () {
  const PALOS = ['oros', 'copas', 'espadas', 'bastos'];
  const VALORES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  const NOMBRES_VALOR = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 10: 'S', 11: 'C', 12: 'R' };
  const PUNTOS_VALOR = { 1: 11, 2: 0, 3: 10, 4: 0, 5: 0, 6: 0, 7: 0, 10: 2, 11: 3, 12: 4 };
  const ORDEN_FUERZA = [1, 3, 12, 11, 10, 7, 6, 5, 4, 2];

  let mazo, triunfo, manoJugador, manoMaquina, puntosJugador, puntosMaquina, turno, cartaMesa;

  function crearMazo() {
    let m = [];
    for (let p of PALOS) for (let v of VALORES) m.push({ palo: p, valor: v });
    for (let i = m.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [m[i], m[j]] = [m[j], m[i]];
    }
    return m;
  }

  function fuerza(carta, paloTriunfo) {
    let base = ORDEN_FUERZA.indexOf(carta.valor);
    return carta.palo === paloTriunfo ? base + 100 : base;
  }

  function ganaBaza(c1, c2, paloTriunfo, paloAbierto) {
    if (c1.palo === c2.palo) return fuerza(c1, paloTriunfo) > fuerza(c2, paloTriunfo);
    if (c1.palo === paloTriunfo) return true;
    if (c2.palo === paloTriunfo) return false;
    if (c1.palo === paloAbierto) return true;
    return false;
  }

  function puntosCarta(carta) { return PUNTOS_VALOR[carta.valor]; }

  function robar() {
    if (mazo.length === 0) return;
    if (manoJugador.length < 3 && mazo.length > 0) manoJugador.push(mazo.pop());
    if (manoMaquina.length < 3 && mazo.length > 0) manoMaquina.push(mazo.pop());
  }

  function mostrarPantalla(id) {
    ['pantalla-inicio', 'pantalla-juego', 'pantalla-fin'].forEach(p => {
      let el = document.getElementById(p);
      if (el) el.classList.toggle('oculta', p !== id);
    });
  }

  function nombreCarta(carta) {
    return NOMBRES_VALOR[carta.valor] + ' de ' + carta.palo;
  }

  function renderMano() {
    let div = document.getElementById('mano-jugador');
    div.innerHTML = '';
    manoJugador.forEach((carta, i) => {
      let btn = document.createElement('button');
      btn.className = 'carta';
      btn.textContent = NOMBRES_VALOR[carta.valor] + '\n' + carta.palo[0].toUpperCase();
      btn.disabled = (turno !== 'jugador' && turno !== 'respuesta-jugador');
      btn.onclick = () => jugarCarta(i);
      div.appendChild(btn);
    });
    document.getElementById('puntos-jugador').textContent = puntosJugador;
    document.getElementById('puntos-maquina').textContent = puntosMaquina;
    document.getElementById('mazo-contador').textContent = mazo.length;
    document.getElementById('triunfo').textContent = nombreCarta(triunfo);
  }

  function setMensaje(txt) {
    let el = document.getElementById('mensaje');
    if (el) el.textContent = txt;
  }

  function iniciar() {
    mazo = crearMazo();
    triunfo = mazo[0];
    manoJugador = [mazo.pop(), mazo.pop(), mazo.pop()];
    manoMaquina = [mazo.pop(), mazo.pop(), mazo.pop()];
    puntosJugador = 0;
    puntosMaquina = 0;
    turno = 'jugador';
    cartaMesa = null;
    mostrarPantalla('pantalla-juego');
    renderMano();
    setMensaje('Elige tu carta.');
  }

  function jugarCarta(idx) {
    if (turno === 'jugador') {
      cartaMesa = manoJugador.splice(idx, 1)[0];
      document.getElementById('carta-jugada-jugador').textContent = nombreCarta(cartaMesa);
      turno = 'maquina';
      renderMano();
      setMensaje('Turno de la máquina...');
      setTimeout(turnoMaquina, 900);
    } else if (turno === 'respuesta-jugador') {
      let cartaJugador = manoJugador.splice(idx, 1)[0];
      document.getElementById('carta-jugada-jugador').textContent = nombreCarta(cartaJugador);
      resolverBaza(cartaMesa, cartaJugador, false);
    }
  }

  function turnoMaquina() {
    if (turno === 'maquina') {
      let idx = Math.floor(Math.random() * manoMaquina.length);
      cartaMesa = manoMaquina.splice(idx, 1)[0];
      document.getElementById('carta-jugada-maquina').textContent = nombreCarta(cartaMesa);
      turno = 'respuesta-jugador';
      renderMano();
      setMensaje('La máquina jugó ' + nombreCarta(cartaMesa) + '. Elige tu carta.');
    }
  }

  function resolverBaza(cartaAbre, cartaResponde, jugadorAbrio) {
    let paloAbierto = cartaAbre.palo;
    let jugadorGana = jugadorAbrio
      ? ganaBaza(cartaAbre, cartaResponde, triunfo.palo, paloAbierto)
      : !ganaBaza(cartaAbre, cartaResponde, triunfo.palo, paloAbierto);

    let pts = puntosCarta(cartaAbre) + puntosCarta(cartaResponde);
    if (jugadorGana) { puntosJugador += pts; turno = 'jugador'; }
    else { puntosMaquina += pts; turno = 'maquina'; }

    cartaMesa = null;
    document.getElementById('carta-jugada-jugador').textContent = '';
    document.getElementById('carta-jugada-maquina').textContent = '';
    robar();

    if (manoJugador.length === 0 && manoMaquina.length === 0) {
      finJuego();
      return;
    }

    renderMano();
    if (turno === 'jugador') setMensaje('Elige tu carta.');
    else setTimeout(turnoMaquina, 900);
  }

  function finJuego() {
    mostrarPantalla('pantalla-fin');
    let titulo = document.getElementById('fin-titulo');
    let detalle = document.getElementById('fin-detalle');
    if (puntosJugador > puntosMaquina) titulo.textContent = '¡Ganaste!';
    else if (puntosMaquina > puntosJugador) titulo.textContent = 'Ganó la máquina.';
    else titulo.textContent = 'Empate.';
    detalle.textContent = 'Tú: ' + puntosJugador + ' — Máquina: ' + puntosMaquina;

    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    ranking.push({ nombre: 'Jugador', puntos: puntosJugador, fecha: new Date().toLocaleDateString() });
    ranking.sort((a, b) => b.puntos - a.puntos);
    localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 10)));
  }

  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-jugar').onclick = iniciar;
    document.getElementById('btn-jugar-de-nuevo').onclick = iniciar;
  });
})();