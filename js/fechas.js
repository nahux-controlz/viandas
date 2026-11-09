// Fechas en formato local. Las fechas se guardan como "AAAA-MM-DD" y se leen
// siempre en la hora del teléfono, para que no se corran un día por la zona horaria.

const larga = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
const corta = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'numeric' });

export function hoyISO() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}

export function aFecha(iso, diasDespues = 0) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d + diasDespues);
}

export function esFechaValida(iso) {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) && !Number.isNaN(aFecha(iso).getTime());
}

/** "lunes 9 de noviembre" */
export const fechaLarga = (iso, diasDespues = 0) => larga.format(aFecha(iso, diasDespues));

/** "lun 9/11" */
export const fechaCorta = (iso, diasDespues = 0) => corta.format(aFecha(iso, diasDespues)).replace(',', '');

export function horaActual() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
