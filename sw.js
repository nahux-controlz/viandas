// Service worker: guarda la app en el teléfono para que abra sin señal.
// Responde con lo guardado y, si hay conexión, actualiza en segundo plano.
// Al cambiar archivos de la app, subir VERSION.
const VERSION = 'viandas-v2';
const ARCHIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/app.js',
  'js/datos.js',
  'js/fechas.js',
  'js/html.js',
  'js/iconos.js',
  'js/compartir.js',
  'js/vistas/inicio.js',
  'js/vistas/trabajo.js',
  'js/vistas/resumen.js',
  'img/icono.svg',
  'img/icono-192.png',
  'fonts/atkinson-hyperlegible-latin-400-normal.woff2',
  'fonts/atkinson-hyperlegible-latin-700-normal.woff2',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const guardada = await cache.match(request, { ignoreSearch: true });
      const red = fetch(request)
        .then((r) => {
          if (r.ok) cache.put(request, r.clone());
          return r;
        })
        .catch(() => guardada);
      if (guardada) {
        e.waitUntil(red);
        return guardada;
      }
      return red;
    }),
  );
});
