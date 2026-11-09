// Íconos SVG decorativos (siempre acompañan a un texto).
const svg = (cuerpo) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${cuerpo}</svg>`;

export const ICONOS = {
  almuerzo: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  cena: svg('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>'),
  mas: svg('<path d="M12 5v14M5 12h14"/>'),
  ok: svg('<path d="m5 12 5 5 9-10"/>'),
  alerta: svg('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>'),
  lista: svg('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>'),
  whatsapp: svg('<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.3 3.2Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2Z"/>'),
  imprimir: svg('<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><path d="M7 14h10v7H7z"/>'),
  volver: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
};
