// Texto de la lista para mandar por WhatsApp (usa *negrita* de WhatsApp).
import { fechaLarga, fechaCorta } from './fechas.js';
import { COMIDAS, LUGARES, totalTrabajo } from './datos.js';

const conHora = (hora) => (hora ? ` (${hora} h)` : '');

export function textoLista(t) {
  const tot = totalTrabajo(t);
  const lineas = [`*Viandas · Barco ${t.barco}*`, `Entró el ${fechaLarga(t.entrada)}`, ''];

  t.dias.forEach((d, i) => {
    lineas.push(`*Día ${i + 1}* (${fechaCorta(t.entrada, i)})`);
    for (const [c, comida] of COMIDAS) {
      lineas.push(`${comida}: ${LUGARES.map(([l, lugar]) => `${lugar} ${d[c][l].cant}${conHora(d[c][l].hora)}`).join(' · ')}`);
    }
    if (d.menu.trim()) lineas.push(`Menú: ${d.menu.trim().replace(/\s*\n\s*/g, ' / ')}`);
    lineas.push('');
  });

  lineas.push(
    `*Total: ${tot.total} viandas en ${t.dias.length} ${t.dias.length === 1 ? 'día' : 'días'}*`,
    LUGARES.map(([l, lugar]) => `${lugar}: ${tot[l]}`).join(' · '),
    COMIDAS.map(([c, comida]) => `${comida}s: ${tot[c]}`).join(' · '),
  );
  return lineas.join('\n');
}

export const enlaceWhatsApp = (t) => `https://wa.me/?text=${encodeURIComponent(textoLista(t))}`;
