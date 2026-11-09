# Viandas

Web app para anotar, día por día, las viandas que se entregan a la tripulación de un barco: almuerzo y cena, en el apartamento y en el puerto, con la hora de entrega y el menú. Al final arma la lista de todo lo trabajado, con el nombre del barco.

| | |
|---|---|
| **App publicada** | https://nahux-controlz.github.io/viandas/ |
| **Repositorio** | https://github.com/nahux-controlz/viandas |

## Para quién es

La hice para mi mamá, que cocina viandas para una empresa que atiende barcos. Hasta ahora llevaba la cuenta en papel. No se lleva bien con la tecnología, así que la app tenía que poder usarse sin explicación:

- **Una sola cosa por pantalla:** primero el barco, después los días, al final la lista.
- **Letra grande y clara:** base de 20 px con Atkinson Hyperlegible, una tipografía hecha para leer fácil.
- **Botones grandes:** al menos 48 px de alto, con − y + para las cantidades, así no hace falta escribir.
- **Nada para guardar:** cada cambio se guarda solo y la app lo avisa.
- **Nada se borra sin preguntar:** borrar un día, terminar un barco o borrar una lista piden confirmación.
- **Palabras de todos los días:** "Terminé: ver la lista", "Agregar el día 3", "¿Qué cocinaste?".

## Cómo se usa

1. Escribir el nombre del barco y la fecha en que entró (si es hoy, ya está puesta).
2. En cada día, anotar cuántas viandas de almuerzo y de cena se entregaron en **Apartamento** y en **Puerto**, a qué hora, y qué se cocinó.
3. Al día siguiente, tocar **Agregar el día 2**. Las horas se copian del día anterior y se pueden cambiar.
4. Al terminar la semana o el mes, tocar **Terminé: ver la lista**. Muestra el total de viandas, los totales por lugar y por comida, una tabla día por día y los menús.
5. Desde la lista se puede **enviar por WhatsApp** o **imprimir / guardar en PDF**.
6. **Terminar con el barco** guarda la lista en *Trabajos anteriores* y deja la app lista para el próximo barco.

## Privacidad

Los datos se guardan **solo en el teléfono** (`localStorage`). No hay servidor, cuentas ni base de datos. La contra es que si se borran los datos del navegador se pierde lo anotado; por eso la app pide al navegador guardado persistente y ofrece mandar la lista por WhatsApp como copia.

## Stack

HTML5, CSS3 y JavaScript vanilla con módulos ES, sin frameworks ni build. Se publica en GitHub Pages con GitHub Actions.

- **Sin conexión:** un service worker guarda la app en el teléfono después de la primera visita. En el puerto puede no haber señal.
- **Instalable:** manifiesto e íconos para agregarla a la pantalla de inicio del celular.
- **Seguridad:** Content Security Policy por `meta` y todo el texto escrito por la persona se escapa antes de mostrarse.

## Estructura

```
├── index.html               página única: encabezado, contenido y pie
├── css/app.css              estilos mobile-first (375, 768 y 1280 px)
├── js/
│   ├── app.js               arranque, navegación entre pantallas y botón Atrás
│   ├── datos.js             modelo de datos, totales y guardado en el teléfono
│   ├── fechas.js            fechas en hora local ("lunes 9 de noviembre", "lun 9/11")
│   ├── compartir.js         texto de la lista para WhatsApp
│   ├── html.js / iconos.js  utilidades
│   └── vistas/              inicio, trabajo (días) y resumen (lista)
├── sw.js                    funcionamiento sin conexión
├── manifest.webmanifest     instalación en el celular
├── img/  fonts/             íconos y tipografía autoalojada
└── .github/workflows/       deploy a GitHub Pages
```

Cada pantalla es un módulo con `html()`, `titulo()` y `montar()`. Al cambiar de pantalla el foco va al título, para lectores de pantalla y teclado, y el botón Atrás del teléfono vuelve a la pantalla anterior en vez de salir de la app.

## Requisitos verificados

| Requisito | Resultado | Cómo se comprobó |
|---|---|---|
| WCAG 2.2 AA | Sin violaciones | axe-core en las 6 pantallas del flujo, en 375, 768 y 1280 px |
| Responsive sin scroll horizontal | 375, 768 y 1280 px, la tabla también entra en 375 | Script con Chrome headless y revisión de capturas |
| Flujo completo | Cargar barco, días, horas y menú, recargar, ver lista, volver atrás y terminar | Script con Chrome headless |
| Sin conexión | La app abre sin red después de la primera visita | Chrome headless en modo offline |
| Movimiento reducido | Transiciones desactivadas con `prefers-reduced-motion` | Revisión del CSS |

## Correr en local

No hace falta compilar, pero hay que servirlo por HTTP (los módulos ES y el service worker no funcionan abriendo el archivo):

```bash
python -m http.server 8000
```

## Deploy

1. En **Settings → Pages → Build and deployment → Source**, elegir **GitHub Actions**.
2. Hacer push a `main`. El workflow [deploy.yml](.github/workflows/deploy.yml) copia los archivos de la app a `_site` y los publica con HTTPS.
3. Si se cambian archivos de la app, subir `VERSION` en `sw.js` para que los teléfonos descarguen la versión nueva.

## Créditos

- **Tipografía:** [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible), del Braille Institute (licencia OFL), vía Fontsource.
- **Íconos:** dibujados en SVG para esta app.
- **Herramientas de verificación:** axe-core y Lighthouse.

## Uso de IA

Se usó un asistente de IA para escribir el código, los textos de la interfaz y este README, a partir de la idea, los pedidos y las correcciones del autor. Las pruebas de accesibilidad, responsive y funcionamiento se hicieron con las herramientas de la tabla anterior. La idea, el contenido y las decisiones sobre qué necesita la persona que la usa son del autor.
