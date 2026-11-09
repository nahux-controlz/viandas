// Fechas en formato local. Las fechas se guardan como "AAAA-MM-DD" y se leen
// siempre en la hora del teléfono, para que no se corran un día por la zona horaria.

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

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

// Se arman a mano porque cada navegador formatea distinto ("lunes, 9", "9-11").

/** "lunes 9 de noviembre" */
export function fechaLarga(iso, diasDespues = 0) {
  const f = aFecha(iso, diasDespues);
  return `${DIAS[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]}`;
}

/** "lun 9/11" */
export function fechaCorta(iso, diasDespues = 0) {
  const f = aFecha(iso, diasDespues);
  return `${DIAS[f.getDay()].slice(0, 3)} ${f.getDate()}/${f.getMonth() + 1}`;
}

export function horaActual() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
