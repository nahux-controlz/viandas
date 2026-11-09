// Arranque y navegación entre pantallas.
// Cada pantalla exporta html(ctx, opciones), titulo(ctx, opciones) y montar(raiz, ctx, opciones).
import { cargar, guardar, pedirGuardadoPersistente } from './datos.js';
import * as inicio from './vistas/inicio.js';
import * as trabajo from './vistas/trabajo.js';

const vistas = { inicio, trabajo };
const principal = document.getElementById('principal');

/** Evita pantallas que no tienen sentido con los datos actuales (por ejemplo, al volver atrás). */
function corregir(nombre, opciones) {
  const { actual } = ctx.datos;
  if (!vistas[nombre]) return corregir('inicio', {});
  if (nombre === 'inicio' && actual && !opciones.editar && vistas.trabajo) return ['trabajo', {}];
  if (nombre === 'inicio' && opciones.editar && !actual) return ['inicio', {}];
  if (nombre === 'trabajo' && !actual) return ['inicio', {}];
  return [nombre, opciones];
}

function mostrar(nombrePedido, opcionesPedidas = {}) {
  const [nombre, opciones] = corregir(nombrePedido, opcionesPedidas);
  const vista = vistas[nombre];
  const raiz = document.createElement('div');
  raiz.className = `pantalla pantalla--${nombre}`;
  raiz.innerHTML = vista.html(ctx, opciones);
  principal.replaceChildren(raiz);
  vista.montar?.(raiz, ctx, opciones);
  document.title = `${vista.titulo(ctx, opciones)} · Viandas`;
  return [nombre, opciones, raiz];
}

const ctx = {
  datos: cargar(),
  guardar: () => guardar(ctx.datos),

  /** Cambia de pantalla, la agrega al historial (para el botón Atrás) y lleva el foco al título. */
  ir(nombrePedido, opcionesPedidas = {}) {
    const { foco, ...resto } = opcionesPedidas;
    const [nombre, opciones, raiz] = mostrar(nombrePedido, resto);
    history.pushState({ nombre, opciones }, '');
    const destino = raiz.querySelector(foco ? `#${foco}` : 'h1');
    if (foco) destino?.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
    destino?.focus({ preventScroll: true });
  },
};

window.addEventListener('popstate', (e) => {
  const { nombre = 'inicio', opciones = {} } = e.state ?? {};
  mostrar(nombre, opciones);
  window.scrollTo(0, 0);
});

const [nombre, opciones] = mostrar(ctx.datos.actual ? 'trabajo' : 'inicio');
history.replaceState({ nombre, opciones }, '');
pedirGuardadoPersistente();
