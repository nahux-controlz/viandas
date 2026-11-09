// Escapa texto escrito por la persona antes de ponerlo en el HTML.
const MAPA = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapar = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) => MAPA[c]);

export const viandas = (n) => `${n} ${n === 1 ? 'vianda' : 'viandas'}`;
