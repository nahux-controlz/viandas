// Inicio: nombre del barco y fecha de entrada. También sirve para corregirlos.
import { escapar } from '../html.js';
import { hoyISO, esFechaValida } from '../fechas.js';
import { nuevoTrabajo } from '../datos.js';

export const titulo = (ctx, { editar } = {}) => (editar ? 'Cambiar barco o fecha' : 'Empezar un barco');

export function html(ctx, { editar = false } = {}) {
  const t = editar ? ctx.datos.actual : null;
  return `
    <h1 tabindex="-1">${editar ? 'Cambiar barco o fecha' : '¿En qué barco estás trabajando?'}</h1>
    <form class="tarjeta formulario" novalidate>
      <div class="campo">
        <label for="barco">Nombre del barco</label>
        <input id="barco" name="barco" type="text" maxlength="60" autocomplete="off" autocapitalize="words"
          enterkeyhint="next" value="${escapar(t?.barco)}" aria-describedby="barco-error">
        <p id="barco-error" class="error" hidden>Escribí el nombre del barco.</p>
      </div>
      <div class="campo">
        <label for="entrada">Fecha en que entró el barco</label>
        <input id="entrada" name="entrada" type="date" value="${t?.entrada ?? hoyISO()}"
          aria-describedby="entrada-ayuda entrada-error">
        <p id="entrada-ayuda" class="ayuda">Si entró hoy, dejala como está.</p>
        <p id="entrada-error" class="error" hidden>Elegí la fecha en que entró el barco.</p>
      </div>
      <div class="acciones">
        <button class="btn btn--principal" type="submit">${editar ? 'Guardar cambios' : 'Empezar'}</button>
        ${editar ? '<button class="btn btn--secundario" type="button" data-accion="cancelar">Cancelar</button>' : ''}
      </div>
    </form>`;
}

function marcar(campo, mal) {
  campo.setAttribute('aria-invalid', String(mal));
  document.getElementById(`${campo.id}-error`).hidden = !mal;
  return mal;
}

export function montar(raiz, ctx, { editar = false } = {}) {
  const form = raiz.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const barco = form.barco.value.trim().replace(/\s+/g, ' ');
    const entrada = form.entrada.value;
    const conError = [
      marcar(form.barco, !barco) && form.barco,
      marcar(form.entrada, !esFechaValida(entrada)) && form.entrada,
    ].filter(Boolean);
    if (conError.length) {
      conError[0].focus();
      return;
    }
    if (editar) Object.assign(ctx.datos.actual, { barco, entrada });
    else ctx.datos.actual = nuevoTrabajo(barco, entrada);
    ctx.guardar();
    ctx.ir('trabajo');
  });

  raiz.querySelector('[data-accion="cancelar"]')?.addEventListener('click', () => ctx.ir('trabajo'));
}
