// Datos de la app y guardado en el teléfono (localStorage).
//
// {
//   actual: { id, barco, entrada: "AAAA-MM-DD", dias: [Dia] } | null,
//   anteriores: [ { ...trabajo, terminado: "AAAA-MM-DD" } ]
// }
// Dia = { almuerzo: { apto: { cant, hora: "HH:MM" }, puerto: {...} }, cena: {...}, menu: "" }

const CLAVE = 'viandas:v1';

export const COMIDAS = [['almuerzo', 'Almuerzo'], ['cena', 'Cena']];
export const LUGARES = [['apto', 'Apartamento'], ['puerto', 'Puerto']];

/** Día vacío. Si se pasa el día anterior, copia sus horas de entrega (suelen repetirse). */
export function nuevoDia(anterior) {
  const dia = { menu: '' };
  for (const [c] of COMIDAS) {
    dia[c] = {};
    for (const [l] of LUGARES) dia[c][l] = { cant: 0, hora: anterior?.[c]?.[l]?.hora ?? '' };
  }
  return dia;
}

export function nuevoTrabajo(barco, entrada) {
  return { id: Date.now().toString(36), barco, entrada, dias: [nuevoDia()] };
}

/** Suma de un día: por comida, por lugar y total. */
export function totalDia(dia) {
  const t = { total: 0 };
  for (const [c] of COMIDAS) t[c] = 0;
  for (const [l] of LUGARES) t[l] = 0;
  for (const [c] of COMIDAS) {
    for (const [l] of LUGARES) {
      const n = dia[c][l].cant;
      t[c] += n;
      t[l] += n;
      t[`${c}-${l}`] = n;
      t.total += n;
    }
  }
  return t;
}

/** Suma de todos los días de un trabajo, con las mismas claves que totalDia. */
export function totalTrabajo(trabajo) {
  const suma = {};
  for (const dia of trabajo.dias) {
    for (const [clave, n] of Object.entries(totalDia(dia))) suma[clave] = (suma[clave] ?? 0) + n;
  }
  return suma;
}

/** Completa lo que falte, por si los datos vienen de una versión anterior. */
function normalizarDia(d = {}) {
  const dia = nuevoDia();
  dia.menu = typeof d.menu === 'string' ? d.menu : '';
  for (const [c] of COMIDAS) {
    for (const [l] of LUGARES) {
      const v = d[c]?.[l] ?? {};
      dia[c][l].cant = Number.isFinite(v.cant) && v.cant > 0 ? Math.floor(v.cant) : 0;
      dia[c][l].hora = /^\d{2}:\d{2}$/.test(v.hora) ? v.hora : '';
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
