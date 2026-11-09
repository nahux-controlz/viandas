// Trabajo en curso: datos del barco y carga de viandas día por día.
// Hay un solo día abierto a la vez; los demás se ven resumidos y se pueden reabrir.
import { escapar, viandas } from '../html.js';
import { fechaLarga, fechaCorta } from '../fechas.js';
import { COMIDAS, LUGARES, nuevoDia, totalDia } from '../datos.js';
import { ICONOS } from '../iconos.js';

export const titulo = (ctx) => `Barco ${ctx.datos.actual.barco}`;

const diaAbierto = (t, abierto) => (Number.isInteger(abierto) && t.dias[abierto] ? abierto : t.dias.length - 1);

export function html(ctx, { abierto } = {}) {
  const t = ctx.datos.actual;
  const n = diaAbierto(t, abierto);
  return `
    <section class="barco tarjeta" aria-labelledby="barco-nombre">
      <p class="barco__etiqueta">Barco</p>
      <h1 id="barco-nombre" class="barco__nombre" tabindex="-1">${escapar(t.barco)}</h1>
      <p>Entró el <strong>${fechaLarga(t.entrada)}</strong></p>
      <button type="button" class="btn-texto" data-accion="editar-barco">Cambiar nombre o fecha</button>
    </section>

    <ol class="dias" aria-label="Días">
      ${t.dias.map((d, i) => `<li>${i === n ? formDia(t, i) : diaCerrado(t, i)}</li>`).join('')}
    </ol>

    <div class="acciones">
      <button type="button" class="btn btn--principal" data-accion="agregar">${ICONOS.mas}Agregar el día ${t.dias.length + 1}</button>
      <button type="button" class="btn btn--secundario" data-accion="resumen">${ICONOS.lista}Terminé: ver la lista</button>
    </div>`;
}

function diaCerrado(t, i) {
  return `
    <button type="button" class="fila" data-accion="abrir" data-dia="${i}">
      <span class="fila__titulo">Día ${i + 1} <span class="fila__dato">${fechaCorta(t.entrada, i)}</span></span>
      <span class="fila__total">${viandas(totalDia(t.dias[i]).total)}</span>
      <span class="fila__accion">Ver o cambiar</span>
    </button>`;
}

function formDia(t, i) {
  const d = t.dias[i];
  return `
    <article class="dia tarjeta" aria-labelledby="dia-titulo">
      <header>
        <h2 id="dia-titulo" tabindex="-1">Día ${i + 1}</h2>
        <p class="dia__fecha">${fechaLarga(t.entrada, i)}</p>
      </header>
      ${COMIDAS.map(([c, comida]) => `
        <fieldset class="comida comida--${c}">
          <legend class="comida__titulo">${ICONOS[c]}${comida}</legend>
          <div class="lugares">
            ${LUGARES.map(([l, lugar]) => campoLugar(d, c, comida, l, lugar)).join('')}
          </div>
        </fieldset>`).join('')}
      <p class="dia__total">Total del día: <strong data-total>${viandas(totalDia(d).total)}</strong></p>
      <p class="dia__guardado" data-guardado>${ICONOS.ok}Se guarda solo, no hace falta apretar nada.</p>
      ${i === t.dias.length - 1 && i > 0 ? `<button type="button" class="btn-texto btn-texto--peligro" data-accion="borrar-dia">Borrar el día ${i + 1}</button>` : ''}
    </article>`;
}

function campoLugar(d, c, comida, l, lugar) {
  const id = `${c}-${l}`;
  const de = `de ${comida.toLowerCase()} en ${lugar}`;
  return `
    <div class="lugar">
      <h3 class="lugar__nombre">${lugar}</h3>
      <label class="lugar__etiqueta" for="${id}-cant">Cantidad<span class="sr-only"> ${de}</span></label>
      <div class="contador">
        <input id="${id}-cant" class="contador__valor" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3"
          autocomplete="off" data-campo="cant" data-c="${c}" data-l="${l}" value="${d[c][l].cant}">
        <button type="button" class="contador__btn contador__btn--menos" data-accion="menos" data-c="${c}" data-l="${l}" aria-label="Una menos ${de}">−</button>
        <button type="button" class="contador__btn contador__btn--mas" data-accion="mas" data-c="${c}" data-l="${l}" aria-label="Una más ${de}">+</button>
      </div>
    </div>`;
}

function actualizar(raiz, dia, guardado) {
  raiz.querySelector('[data-total]').textContent = viandas(totalDia(dia).total);
  const aviso = raiz.querySelector('[data-guardado]');
  aviso.classList.toggle('dia__guardado--error', !guardado);
  aviso.innerHTML = guardado
    ? `${ICONOS.ok}Guardado.`
    : `${ICONOS.alerta}No se pudo guardar en este teléfono. Mandá la lista por WhatsApp para no perderla.`;
}

export function montar(raiz, ctx, { abierto } = {}) {
  const t = ctx.datos.actual;
  const n = diaAbierto(t, abierto);
  const dia = t.dias[n];
  const cambio = () => actualizar(raiz, dia, ctx.guardar());

  raiz.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-accion]');
    if (!boton) return;
    const { accion, c, l } = boton.dataset;

    if (accion === 'menos' || accion === 'mas') {
      const v = dia[c][l];
      v.cant = Math.min(999, Math.max(0, v.cant + (accion === 'mas' ? 1 : -1)));
      raiz.querySelector(`#${c}-${l}-cant`).value = v.cant;
      cambio();
    } else if (accion === 'abrir') {
      ctx.ir('trabajo', { abierto: Number(boton.dataset.dia), foco: 'dia-titulo' });
    } else if (accion === 'agregar') {
      t.dias.push(nuevoDia());
      ctx.guardar();
      ctx.ir('trabajo', { foco: 'dia-titulo' });
    } else if (accion === 'borrar-dia') {
      if (window.confirm(`¿Borrar el día ${t.dias.length}? Se pierde lo que anotaste en ese día.`)) {
        t.dias.pop();
        ctx.guardar();
        ctx.ir('trabajo', { foco: 'dia-titulo' });
      }
    } else if (accion === 'editar-barco') {
      ctx.ir('inicio', { editar: true });
    } else if (accion === 'resumen') {
      ctx.ir('resumen');
    }
  });

  raiz.addEventListener('input', (e) => {
    const campo = e.target;
    if (campo.dataset.campo === 'cant') {
      const limpio = campo.value.replace(/\D/g, '').slice(0, 3);
      if (limpio !== campo.value) campo.value = limpio;
      dia[campo.dataset.c][campo.dataset.l].cant = Number(limpio) || 0;
    } else {
      return;
    }
    cambio();
  });

  // Al tocar una cantidad se selecciona el número, así se escribe encima sin borrar.
  raiz.addEventListener('focusin', (e) => {
    if (e.target.dataset.campo === 'cant') setTimeout(() => e.target.select(), 0);
  });
  raiz.addEventListener('focusout', (e) => {
    if (e.target.dataset.campo === 'cant' && e.target.value === '') e.target.value = '0';
  });
}
