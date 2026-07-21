/* ui.js — Todo lo visual. Lee `estado` de game.js y lo convierte en HTML.
   Nunca decide reglas de juego: solo pinta y reenvía clics. */
(function () {

const { NOMBRES_VALOR, nombreCarta } = window.Cards;

const ICONOS_PALO = {
  oros: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12"/><circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.1"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>',
  copas: '<svg viewBox="0 0 24 24"><path d="M4 2.3h16c0 4.1-1.3 6.1-2.6 7.5-1.1 1.1-2.3 1.7-2.3 3.1v1.4h2.1v1.8H6.8v-1.8h2.1v-1.4c0-1.4-1.2-2-2.3-3.1C5.3 8.4 4 6.4 4 2.3z" fill="currentColor"/><path d="M7.2 19.7h9.6l-0.9 2H8.1z" fill="currentColor"/></svg>',
  espadas: '<svg viewBox="0 0 24 24"><polygon points="12,0.8 10.2,4.2 13.8,4.2" fill="currentColor"/><rect x="11.1" y="4.2" width="1.8" height="12.6" fill="currentColor"/><rect x="6.2" y="15.4" width="11.6" height="2.1" rx="0.6" fill="currentColor"/><rect x="10.6" y="17.5" width="2.8" height="1.7" fill="currentColor"/><circle cx="12" cy="20.6" r="1.9" fill="currentColor"/></svg>',
  bastos: '<svg viewBox="0 0 24 24"><g transform="rotate(18 12 12)"><rect x="9.4" y="1.3" width="5.2" height="21.4" rx="2.6" fill="currentColor"/><ellipse cx="12" cy="6.2" rx="2.8" ry="1.3" fill="#00000035"/><ellipse cx="12" cy="12" rx="2.8" ry="1.3" fill="#00000035"/><ellipse cx="12" cy="17.8" rx="2.8" ry="1.3" fill="#00000035"/></g></svg>'
};

// Disposición de los "pips" (símbolos repetidos) para las cartas numerales 1-7,
// igual que en una baraja española real: filas que se alternan boca abajo.
const DISTRIBUCION_PIPS = {
  1: [{ n: 1, grande: true }],
  2: [{ n: 1 }, { n: 1, rot: true }],
  3: [{ n: 1 }, { n: 1 }, { n: 1, rot: true }],
  4: [{ n: 2 }, { n: 2, rot: true }],
  5: [{ n: 2 }, { n: 1 }, { n: 2, rot: true }],
  6: [{ n: 2 }, { n: 2 }, { n: 2, rot: true }],
  7: [{ n: 2 }, { n: 1 }, { n: 2 }, { n: 2, rot: true }]
};

function crearPipsHTML(carta) {
  const filas = DISTRIBUCION_PIPS[carta.valor];
  return `<div class="carta-pips">${filas
    .map(fila => {
      const claseTam = 'carta-pip' + (fila.grande ? ' carta-pip-grande' : '');
      const claseRot = fila.rot ? ' carta-pip-rot' : '';
      const pip = `<span class="${claseTam}${claseRot}">${ICONOS_PALO[carta.palo]}</span>`;
      return `<div class="carta-pips-fila">${pip.repeat(fila.n)}</div>`;
    })
    .join('')}</div>`;
}

function crearFiguraHTML(carta) {
  return `
    <div class="carta-figura">
      <span class="carta-figura-letra">${NOMBRES_VALOR[carta.valor]}</span>
      <span class="carta-figura-icono">${ICONOS_PALO[carta.palo]}</span>
    </div>
  `;
}

function crearCentroHTML(carta) {
  return carta.valor >= 10 ? crearFiguraHTML(carta) : crearPipsHTML(carta);
}

const pantallas = {
  inicio: document.getElementById('pantalla-inicio'),
  ranking: document.getElementById('pantalla-ranking'),
  juego: document.getElementById('pantalla-juego'),
  fin: document.getElementById('pantalla-fin')
};

const el = {
  inputNombre: document.getElementById('input-nombre'),
  btnJugar: document.getElementById('btn-jugar'),
  btnVerRanking: document.getElementById('btn-ver-ranking'),
  btnVolverInicio: document.getElementById('btn-volver-inicio'),
  btnBorrarRanking: document.getElementById('btn-borrar-ranking'),
  cuerpoRanking: document.getElementById('cuerpo-ranking'),

  nombreJugadorLbl: document.getElementById('nombre-jugador-lbl'),
  puntosJugadorLbl: document.getElementById('puntos-jugador'),
  puntosMaquinaLbl: document.getElementById('puntos-maquina'),

  manoMaquina: document.getElementById('mano-maquina'),
  manoJugador: document.getElementById('mano-jugador'),
  mazoContador: document.getElementById('mazo-contador'),
  zonaTriunfo: document.getElementById('zona-triunfo'),
  cartaJugadaJugador: document.getElementById('carta-jugada-jugador'),
  cartaJugadaMaquina: document.getElementById('carta-jugada-maquina'),
  mensaje: document.getElementById('mensaje'),
  btnMenu: document.getElementById('btn-menu'),

  finTitulo: document.getElementById('fin-titulo'),
  finDetalle: document.getElementById('fin-detalle'),
  btnJugarDeNuevo: document.getElementById('btn-jugar-de-nuevo'),
  btnFinRanking: document.getElementById('btn-fin-ranking')
};

function mostrarPantalla(nombre) {
  Object.values(pantallas).forEach(p => p.classList.add('oculta'));
  pantallas[nombre].classList.remove('oculta');
}

function crearCartaHTML(carta, { boton = false, pequena = false } = {}) {
  const claseTamano = pequena ? 'carta carta-mini' : 'carta';
  const etiqueta = NOMBRES_VALOR[carta.valor];
  const tag = boton ? 'button' : 'div';
  const claseExtra = boton ? 'class="' + claseTamano + ' carta-' + carta.palo + ' jugable"' : 'class="' + claseTamano + ' carta-' + carta.palo + '"';
  return `
    <${tag} ${claseExtra} title="${nombreCarta(carta)}">
      <span class="carta-esquina carta-esquina-sup">${etiqueta}<i class="icono-palo">${ICONOS_PALO[carta.palo]}</i></span>
      <div class="carta-centro">${crearCentroHTML(carta)}</div>
      <span class="carta-esquina carta-esquina-inf">${etiqueta}<i class="icono-palo">${ICONOS_PALO[carta.palo]}</i></span>
    </${tag}>
  `;
}

function crearDorsoHTML() {
  return `<div class="carta carta-dorso"><span class="carta-dorso-marca">LB</span></div>`;
}

function renderTodo(estado) {
  el.nombreJugadorLbl.textContent = estado.nombreJugador;
  el.puntosJugadorLbl.textContent = estado.puntosJugador;
  el.puntosMaquinaLbl.textContent = estado.puntosMaquina;

  el.manoMaquina.innerHTML = estado.manoMaquina.map(() => crearDorsoHTML()).join('');

  el.manoJugador.innerHTML = estado.manoJugador
    .map((carta, i) => {
      const puedeJugar = estado.jugando && (!estado.cartaLider || estado.cartaLider.de === 'maquina');
      const html = crearCartaHTML(carta, { boton: puedeJugar });
      return puedeJugar ? html.replace('<button', `<button data-indice="${i}"`) : html;
    })
    .join('');

  el.manoJugador.querySelectorAll('button.jugable').forEach(btnEl => {
    btnEl.addEventListener('click', () => {
      window.Game.jugarCartaJugador(Number(btnEl.dataset.indice));
    });
  });

  el.mazoContador.textContent = estado.mazo.length;
  el.zonaTriunfo.innerHTML = estado.triunfo ? crearCartaHTML(estado.triunfo, { pequena: true }) : '';

  el.cartaJugadaJugador.innerHTML = estado.cartaLider && estado.cartaLider.de === 'jugador'
    ? crearCartaHTML(estado.cartaLider.carta)
    : (estado.ultimoResultado ? crearCartaHTML(estado.ultimoResultado.cartaJugador) : '');

  el.cartaJugadaMaquina.innerHTML = estado.cartaLider && estado.cartaLider.de === 'maquina'
    ? crearCartaHTML(estado.cartaLider.carta)
    : (estado.ultimoResultado && !estado.cartaLider ? crearCartaHTML(estado.ultimoResultado.cartaMaquina) : '');
}

function mostrarMensaje(texto) {
  el.mensaje.textContent = texto;
}

function mostrarResultadoBaza(resultado, nombreJugador) {
  const quien = resultado.ganador === 'jugador' ? nombreJugador : 'la máquina';
  const texto = resultado.puntosBaza > 0
    ? `¡Baza para ${quien}! (+${resultado.puntosBaza} puntos)`
    : `Baza para ${quien}. (sin puntos)`;
  mostrarMensaje(texto);
}

function renderRanking() {
  const ranking = window.Storage.obtenerRanking();
  if (ranking.length === 0) {
    el.cuerpoRanking.innerHTML = `<tr><td colspan="4" class="ranking-vacio">Todavía no hay puntajes. ¡Sé el primero!</td></tr>`;
    return;
  }
  el.cuerpoRanking.innerHTML = ranking
    .map((entrada, i) => {
      const medalla = i === 0 ? 'oro' : i === 1 ? 'plata' : i === 2 ? 'bronce' : '';
      const resultadoTxt = { ganaste: 'Ganó', perdiste: 'Perdió', empate: 'Empate' }[entrada.resultado] || '';
      return `
        <tr class="fila-ranking ${medalla}">
          <td>${i + 1}</td>
          <td>${escapeHTML(entrada.nombre)}</td>
          <td>${entrada.puntos}</td>
          <td>${resultadoTxt} · ${window.Storage.formatearFecha(entrada.fecha)}</td>
        </tr>`;
    })
    .join('');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function mostrarPantallaFin(estado, resultado, ranking) {
  const textos = {
    ganaste: '¡GANASTE!',
    perdiste: 'PERDISTE',
    empate: 'EMPATE'
  };
  el.finTitulo.textContent = textos[resultado];
  el.finTitulo.className = `fin-titulo fin-${resultado}`;
  el.finDetalle.textContent = `${estado.nombreJugador}: ${estado.puntosJugador} puntos · Máquina: ${estado.puntosMaquina} puntos`;
  mostrarPantalla('fin');
}

/* ---------- Eventos de pantalla de inicio / navegación ---------- */

function empezarPartidaDesdeInicio() {
  try {
    const nombre = el.inputNombre.value.trim() || 'Jugador';
    mostrarPantalla('juego');
    window.Game.iniciarPartida(nombre);
  } catch (error) {
    const banner = document.getElementById('banner-error');
    banner.textContent = 'Error real al iniciar partida: ' + error.message + ' | ' + (error.stack || '');
    banner.classList.remove('oculta');
    console.error(error);
  }
}

el.btnJugar.addEventListener('click', empezarPartidaDesdeInicio);
el.inputNombre.addEventListener('keydown', e => {
  if (e.key === 'Enter') empezarPartidaDesdeInicio();
});

el.btnVerRanking.addEventListener('click', () => {
  renderRanking();
  mostrarPantalla('ranking');
});

el.btnVolverInicio.addEventListener('click', () => mostrarPantalla('inicio'));

el.btnBorrarRanking.addEventListener('click', () => {
  if (confirm('¿Borrar todos los puntajes guardados? Esta acción no se puede deshacer.')) {
    window.Storage.limpiarRanking();
    renderRanking();
  }
});

el.btnMenu.addEventListener('click', () => {
  window.Game.estado.jugando = false;
  mostrarPantalla('inicio');
});

el.btnJugarDeNuevo.addEventListener('click', () => {
  mostrarPantalla('juego');
  window.Game.iniciarPartida(window.Game.estado.nombreJugador);
});

el.btnFinRanking.addEventListener('click', () => {
  renderRanking();
  mostrarPantalla('ranking');
});

window.UI = {
  mostrarPantalla,
  renderTodo,
  mostrarMensaje,
  mostrarResultadoBaza,
  mostrarPantallaFin,
  renderRanking
};

mostrarPantalla('inicio');

})();
