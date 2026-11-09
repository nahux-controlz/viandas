// Lista de lo trabajado: totales del barco, detalle por día y menús.
import { escapar, viandas } from '../html.js';
import { fechaLarga, fechaCorta } from '../fechas.js';
import { COMIDAS, LUGARES, totalDia, totalTrabajo } from '../datos.js';
import { ICONOS } from '../iconos.js';

export const titulo = (ctx, opciones) => `Lista del barco ${buscar(ctx, opciones)?.barco ?? ''}`;

/** El trabajo en curso o, si se pasa un id, uno de los anteriores. */
export const buscar = (ctx, { id } = {}) => (id ? ctx.datos.anteriores.find((t) => t.id === id) : ctx.datos.actual);

const COLUMNAS = COMIDAS.flatMap(([c]) => LUGARES.map(([l]) => `${c}-${l}`));
const abreviar = (lugar) => (lugar === 'Apartamento' ? 'Apto.' : lugar);

function celda(dia, c, l) {
  const { cant, hora } = dia[c][l];
  return `<td>${cant}${hora ? `<small>${hora}</small>` : ''}</td>`;
}

function tabla(t) {
  const tot = totalTrabajo(t);
  return `
    <div class="tabla" role="region" aria-labelledby="titulo-dias" tabindex="0">
      <table>
        <thead>
          <tr>
            <th scope="col" rowspan="2">Día</th>
            ${COMIDAS.map(([c, comida]) => `<th scope="colgroup" colspan="${LUGARES.length}" class="tabla__${c}">${comida}</th>`).join('')}
            <th scope="col" rowspan="2" class="tabla__total">Total</th>
          </tr>
          <tr>
            ${COMIDAS.map(() => LUGARES.map(([, lugar]) => `<th scope="col"><abbr title="${lugar}">${abreviar(lugar)}</abbr></th>`).join('')).join('')}
          </tr>
        </thead>
        <tbody>
          ${t.dias.map((d, i) => `
            <tr>
              <th scope="row">${i + 1}<small>${fechaCorta(t.entrada, i)}</small></th>
              ${COMIDAS.map(([c]) => LUGARES.map(([l]) => celda(d, c, l)).join('')).join('')}
              <td class="tabla__total"><strong>${totalDia(d).total}</strong></td>
            </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            ${COLUMNAS.map((k) => `<td>${tot[k]}</td>`).join('')}
            <td class="tabla__total">${tot.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <p class="ayuda">Debajo de cada cantidad está la hora de entrega.</p>`;
}

function menus(t) {
  const conMenu = t.dias.map((d, i) => [i, d.menu.trim()]).filter(([, m]) => m);
  if (!conMenu.length) return '<p class="ayuda">No anotaste menús en este barco.</p>';
  return `<ol class="menus">${conMenu.map(([i, m]) => `
    <li><strong>Día ${i + 1}</strong> <span class="fila__dato">${fechaCorta(t.entrada, i)}</span><p>${escapar(m)}</p></li>`).join('')}</ol>`;
}

export function html(ctx, opciones = {}) {
  const t = buscar(ctx, opciones);
  const tot = totalTrabajo(t);
  const n = t.dias.length;
  return `
    <section class="resumen tarjeta" aria-labelledby="resumen-titulo">
      <header class="resumen__cabecera">
        <p class="barco__etiqueta">Lista de lo trabajado</p>
        <h1 id="resumen-titulo" tabindex="-1">Barco ${escapar(t.barco)}</h1>
        <p>Entró el <strong>${fechaLarga(t.entrada)}</strong>.</p>
        <p>${n} ${n === 1 ? 'día' : 'días'}: ${n === 1 ? fechaCorta(t.entrada) : `del ${fechaCorta(t.entrada)} al ${fechaCorta(t.entrada, n - 1)}`}.</p>
      </header>

      <div class="totales">
        <p class="totales__grande"><span>Total</span> <strong>${tot.total}</strong> <span>${tot.total === 1 ? 'vianda' : 'viandas'}</span></p>
        <dl class="totales__detalle">
          ${LUGARES.map(([l, lugar]) => `<div><dt>${lugar}</dt><dd>${viandas(tot[l])}</dd></div>`).join('')}
          ${COMIDAS.map(([c, comida]) => `<div><dt>${comida}s</dt><dd>${viandas(tot[c])}</dd></div>`).join('')}
        </dl>
      </div>

      <h2 id="titulo-dias">Día por día</h2>
      ${tabla(t)}

      <h2>Menús</h2>
      ${menus(t)}
    </section>

    <div class="acciones no-imprimir">
      ${opciones.id ? '' : `<button type="button" class="btn btn--secundario" data-accion="volver">${ICONOS.volver}Volver a anotar días</button>`}
    </div>`;
}

export function montar(raiz, ctx) {
  raiz.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-accion]');
    if (boton?.dataset.accion === 'volver') ctx.ir('trabajo');
  });
}
