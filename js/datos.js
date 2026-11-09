// Datos de la app y guardado en el teléfono (localStorage).
//
// {
//   actual: { id, barco, entrada: "AAAA-MM-DD", dias: [Dia] } | null,
//   anteriores: [ { ...trabajo, terminado: "AAAA-MM-DD" } ]
// }
// Dia = { almuerzo: { apto: { cant }, puerto: { cant } }, cena: {...}, menu: "" }

const CLAVE = 'viandas:v1';

export const COMIDAS = [['almuerzo', 'Almuerzo'], ['cena', 'Cena']];
export const LUGARES = [['apto', 'Apartamento'], ['puerto', 'Puerto']];

export function nuevoDia() {
  const dia = { menu: '' };
  for (const [c] of COMIDAS) {
    dia[c] = {};
    for (const [l] of LUGARES) dia[c][l] = { cant: 0 };
  }
  return dia;
}

export function nuevoTrabajo(barco, entrada) {
  return { id: Date.now().toString(36), barco, entrada, dias: [nuevoDia()] };
}

/** Completa lo que falte, por si los datos vienen de una versión anterior. */
function normalizarDia(d = {}) {
  const dia = nuevoDia();
  dia.menu = typeof d.menu === 'string' ? d.menu : '';
  for (const [c] of COMIDAS) {
    for (const [l] of LUGARES) {
      const v = d[c]?.[l] ?? {};
      dia[c][l].cant = Number.isFinite(v.cant) && v.cant > 0 ? Math.floor(v.cant) : 0;
    }
  }
  return dia;
}

function normalizarTrabajo(t) {
  if (!t || typeof t.barco !== 'string' || typeof t.entrada !== 'string') return null;
  const dias = Array.isArray(t.dias) && t.dias.length ? t.dias.map(normalizarDia) : [nuevoDia()];
  return { ...t, dias };
}

export function cargar() {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE));
    if (d && typeof d === 'object') {
      return {
        actual: normalizarTrabajo(d.actual),
        anteriores: Array.isArray(d.anteriores) ? d.anteriores.map(normalizarTrabajo).filter(Boolean) : [],
      };
    }
  } catch {
    /* Sin datos o sin acceso al almacenamiento: se empieza de cero. */
  }
  return { actual: null, anteriores: [] };
}

/** Devuelve false si el teléfono no dejó guardar. */
export function guardar(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
    return true;
  } catch {
    return false;
  }
}

/** Pide al navegador que no borre los datos cuando falta espacio. */
export function pedirGuardadoPersistente() {
  navigator.storage?.persist?.().catch(() => {});
}
