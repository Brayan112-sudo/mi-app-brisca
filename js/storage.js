/* storage.js — "Base de datos" de puntajes, persistida en localStorage. */
(function () {

const CLAVE_RANKING = 'brisca_ranking_v1';
const MAX_ENTRADAS = 50;

function obtenerRanking() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_RANKING));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.warn('No se pudo leer el ranking guardado, se reinicia.', error);
    return [];
  }
}

function guardarPuntaje({ nombre, puntos, resultado }) {
  const ranking = obtenerRanking();
  const entrada = {
    nombre: (nombre || 'Jugador').slice(0, 20),
    puntos,
    resultado, // 'ganaste' | 'perdiste' | 'empate'
    fecha: new Date().toISOString()
  };
  ranking.push(entrada);
  ranking.sort((a, b) => b.puntos - a.puntos);
  const recortado = ranking.slice(0, MAX_ENTRADAS);
  try {
    localStorage.setItem(CLAVE_RANKING, JSON.stringify(recortado));
  } catch (error) {
    console.warn('No se pudo guardar el puntaje.', error);
  }
  return { ranking: recortado, entrada };
}

function limpiarRanking() {
  localStorage.removeItem(CLAVE_RANKING);
}

function formatearFecha(isoString) {
  try {
    const fecha = new Date(isoString);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  } catch {
    return '';
  }
}

window.Storage = {
  obtenerRanking,
  guardarPuntaje,
  limpiarRanking,
  formatearFecha
};

})();
