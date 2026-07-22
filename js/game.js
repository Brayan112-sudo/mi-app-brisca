/* game.js - La Brisca */
(function () {
  const PALOS = ['oros', 'copas', 'espadas', 'bastos'];
  const VALORES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  const NOMBRES_VALOR = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 10: 'S', 11: 'C', 12: 'R' };
  const PUNTOS_VALOR = { 1: 11, 2: 0, 3: 10, 4: 0, 5: 0, 6: 0, 7: 0, 10: 2, 11: 3, 12: 4 };
  const ORDEN_FUERZA = [1, 3, 12, 11, 10, 7, 6, 5, 4, 2];

  let mazo, triunfo, manoJugador, manoMaquina, puntosJugador, puntosMaquina, turno, nombreJugador, cartaMesa;

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

  function puntos(cartas) {
    return cartas.reduce((s, c) => s + PUNTOS_VALOR[c.valor], 0);
  }

  function robar() {
    if (mazo.length === 0) return;
    if (manoJugador.length < 3 && mazo.length > 0) manoJugador.push(mazo.pop());
    if (manoMaquina.length < 3 && mazo.length > 0) manoMaquina.push(mazo.pop());
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
    renderizar();
  }

  function renderizar() {
    document.getElementById('puntos-jugador').textContent = puntosJugador;
    document.getElementById('puntos-maquina').textContent = puntosMaquina;
    document.getElementById('cartas-mazo').textContent = mazo.length;
    document.getElementById('triunfo').textContent = NOMBRES_VALOR[triunfo.valor] + ' de ' + triunfo.palo;

    let divMano = document.getElementById('mano-jugador');
    divMano.innerHTML = '';
    manoJugador.forEach((carta, i) => {
      let btn = document.createElement('button');
      btn.className = 'carta';
      btn.textContent = NOMBRES_VALOR[carta.valor] + '\n' + carta.palo[0].toUpperCase();
      btn.onclick = () => jugarCarta(i);
      if (turno !== 'jugador') btn.disabled = true;
      divMano.appendChild(btn);
    });

    let msg = document.getElementById('mensaje');
    if (turno === 'jugador') msg.textContent = 'Elige tu carta.';
    else if (turno === 'maquina') msg.textContent = 'Turno de la máquina...';
    else if (turno === 'respuesta-jugador') msg.textContent = 'La máquina abrió la baza. Elige tu carta.';
    else msg.textContent = '';
  }

  function jugarCarta(idx) {
    if (turno === 'jugador') {
      cartaMesa = manoJugador.splice(idx, 1)[0];
      turno = 'maquina';
      renderizar();
      setTimeout(turnoMaquina, 800);
    } else if (turno === 'respuesta-jugador') {
      let cartaJugador = manoJugador.splice(idx, 1)[0];
      resolverBaza(cartaMesa, cartaJugador, false);
    }
  }

  function turnoMaquina() {
    if (turno === 'maquina') {
      // Máquina abre la baza
      let idx = Math.floor(Math.random() * manoMaquina.length);
      cartaMesa = manoMaquina.splice(idx, 1)[0];
      turno = 'respuesta-jugador';
      renderizar();
    }
  }

  function resolverBaza(cartaAbre, cartaResponde, jugadorAbrio) {
    let paloAbierto = cartaAbre.palo;
    let jugadorGana;
    if (jugadorAbrio) {
      jugadorGana = ganaBaza(cartaAbre, cartaResponde, triunfo.palo, paloAbierto);
    } else {
      jugadorGana = !ganaBaza(cartaAbre, cartaResponde, triunfo.palo, paloAbierto);
    }

    let puntosBaza = PUNTOS_VALOR[cartaAbre.valor] + PUNTOS_VALOR[cartaResponde.valor];
    if (jugadorGana) {
      puntosJugador += puntosBaza;
      turno = 'jugador';
    } else {
      puntosMaquina += puntosBaza;
      turno = 'maquina';
    }

    cartaMesa = null;
    robar();

    if (manoJugador.length === 0 && manoMaquina.length === 0) {
      finJuego();
      return;
    }

    renderizar();
    if (turno === 'maquina') setTimeout(turnoMaquina, 800);
  }

  function finJuego() {
    let msg = document.getElementById('mensaje');
    if (puntosJugador > puntosMaquina) msg.textContent = '¡Ganaste! ' + puntosJugador + ' vs ' + puntosMaquina;
    else if (puntosMaquina > puntosJugador) msg.textContent = 'Ganó la máquina. ' + puntosMaquina + ' vs ' + puntosJugador;
    else msg.textContent = 'Empate. ' + puntosJugador + ' cada uno.';

    // Guardar ranking
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    ranking.push({ nombre: nombreJugador || 'Jugador', puntos: puntosJugador, fecha: new Date().toLocaleDateString() });
    ranking.sort((a, b) => b.puntos - a.puntos);
    localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 10)));
    mostrarRanking();

    document.getElementById('btn-reiniciar').style.display = 'block';
  }

  function mostrarRanking() {
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    let div = document.getElementById('ranking');
    if (!div) return;
    div.innerHTML = '<h3>🏆 Ranking</h3>';
    ranking.forEach((r, i) => {
      div.innerHTML += `<p>${i+1}. ${r.nombre} — ${r.puntos} pts (${r.fecha})</p>`;
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    nombreJugador = localStorage.getItem('nombreJugador') || 'Jugador';
    document.getElementById('nombre-jugador').textContent = nombreJugador;
    mostrarRanking();

    let btnJugar = document.getElementById('btn-jugar');
    if (btnJugar) btnJugar.onclick = iniciar;

    let btnReiniciar = document.getElementById('btn-reiniciar');
    if (btnReiniciar) {
      btnReiniciar.style.display = 'none';
      btnReiniciar.onclick = () => { btnReiniciar.style.display = 'none'; iniciar(); };
    }
  });
})();