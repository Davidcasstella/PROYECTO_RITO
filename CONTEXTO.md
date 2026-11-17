# Contexto del proyecto

> Actualizar este archivo al terminar cada tarea importante, para poder retomar en otro chat.

## Qué es

Web de **RITO Rooftop · Gastrobar & Terraza**, en Sogamoso (Boyacá). Seis páginas con su
propia URL, diseño negro + latón + mármol, y funciones de servidor para reservas y contacto.

- Repositorio: `Davidcasstella/PROYECTO_RITO` (rama `main`).
- Vercel: proyecto `proyecto_rito` en "David's projects", conectado a GitHub. Cada push a
  `main` se publica solo.

Proyectos hermanos de referencia (mismo autor y estructura parecida):
`PROYECTO_RESTAURANTE_DAVID` (restaurante italiano) y `PROYECTO_AUREO` (gastrobar en Sogamoso).

## De dónde salen los datos (no inventar nada)

Consultado el 17 de noviembre de 2026:

| Dato                                                                                   | Fuente                                                                       |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Nombre, lema, estilo, eventos                                                          | Instagram @ritorooftop                                                       |
| WhatsApp 320 397 3011 y reglas de reserva (hasta las 8:00 p. m., 25 min de tolerancia) | Enlace de reservas del perfil (shorturl.at/PdZPi → plantilla de WhatsApp)    |
| Dirección Cra. 10 #12-14 y horario                                                     | Ficha de Google Maps "RITO Rooftop"                                          |
| Fotos                                                                                  | Carpeta `Escritorio/Para_proyec_Nuevos/PROYECTO_RITO` del usuario (20 fotos) |

**Pendiente del cliente**: platos y precios de la carta, correo, Facebook, videos para el
recorrido por scroll. Las dos fotos donde salen personas de frente (selfie en el espejo) no se
usan.

## Las páginas

| Ruta        | Qué lleva                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`         | Pantalla de carga → portada con la vista de la terraza → "Un ritual que se sube" → índice de la carta → pausa con la vista y una frase del Instagram → agenda (se oculta sola cuando pasa la fecha) → caminos |
| `/menu`     | Cinco categorías con foto y texto; índice fijo; si una categoría no tiene platos, ofrece pedir la carta por WhatsApp                                                                                          |
| `/nosotros` | "El rooftop": recorrido escalera → muro de latón → salón → terraza, y planes                                                                                                                                  |
| `/galeria`  | 13 fotos reales en cuatro categorías, con visor ampliado                                                                                                                                                      |
| `/contacto` | Dirección, WhatsApp, horario, Instagram, mapa y formulario                                                                                                                                                    |
| `/reservas` | Formulario con horas válidas y condiciones del local                                                                                                                                                          |

`/carta` → `/menu` y `/rooftop` → `/nosotros`.

## Cómo funcionan las reservas

1. El formulario solo ofrece horas reservables: de 12:00 m. a 8:00 p. m. cada media hora, y si
   es hoy, solo las que aún no han pasado (hora de Sogamoso, sea cual sea la del visitante).
2. Al enviar, `POST /api/reservas` vuelve a validar (las reglas están en `shared/`, las mismas
   para navegador y servidor), da un código `R-XXXXX` y devuelve el enlace de WhatsApp con el
   mensaje en el formato de la plantilla del restaurante.
3. El cliente pulsa "Enviar por WhatsApp" y RITO confirma por ahí, como ya trabaja hoy. La web
   nunca dice "reserva confirmada".
4. Opcional: con `RESERVAS_WEBHOOK_URL` en Vercel, cada solicitud se reenvía a ese servicio
   (Make, Zapier, Google Apps Script…) para guardarla en una hoja. Ver `.env.example`.

Si `/api` no responde (por ejemplo con `npm run dev`, que no ejecuta funciones), el navegador
arma el mismo enlace y no bloquea a nadie.

## Estructura

```
api/                 funciones de Vercel: reservas.ts, contacto.ts, estado.ts
shared/              reglas compartidas navegador/servidor: horario, reservas, contacto
frontend/            React 19 + TypeScript + Vite + Tailwind 4 + Motion
  src/config/site.ts   datos editables (nombre, dirección, redes…)
  src/features/menu/menu.ts   la carta: aquí se añaden platos
  src/features/agenda/agenda.ts   eventos (se ocultan solos al pasar la fecha)
  src/styles/globals.css   tokens de diseño (colores, tipografías, animaciones)
scripts/video-a-fotogramas.mjs   videos → fotogramas WebP para el scroll
```

## Sistema de diseño

|                       |                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Negro de los listones | `#0b0a08` fondo · `#16130e` superficie                                                                               |
| Latón del logo        | `#c9a24b` botones (tinta negra encima, 9,4:1) · `#7a5a18` texto sobre mármol (6,6:1) · `#e3c171` acentos sobre negro |
| Mármol                | `#efe9de` secciones claras · tinta `#15110b`                                                                         |
| Cuero coñac           | `#2a1911` panel de la agenda                                                                                         |

Cormorant Garamond (títulos, con cursiva para la palabra en latón) y Jost (texto y etiquetas en
versales muy abiertas, como el "GASTROBAR" del logo). El sol del logo es un SVG propio
(`components/layout/Sol.tsx`) que gira muy despacio. `.texto-laton` hace el degradado dorado
con reflejo; `.listones` dibuja el muro de vetas con CSS.

Movimiento: paralaje suave en fotos de fondo, cortinas al revelar fotos, sol girando. Todo se
detiene con `prefers-reduced-motion`.

## Videos para el scroll (pendiente)

El usuario va a generar videos para un recorrido controlado por el scroll, como en el
restaurante italiano. Cuando lleguen:

1. `node scripts/video-a-fotogramas.mjs originales/entrada.mp4 entrada` (necesita ffmpeg).
2. En `pages/home/sections/Portada.tsx`, cambiar la foto por `<FrameSequence>` con
   `secuenciaEntrada` (ya existen el componente y la configuración en
   `features/secuencias/secuencias.ts`; ver cómo lo usa `PROYECTO_RESTAURANTE_DAVID`).
3. Añadir los primeros fotogramas a `RECURSOS` en `components/layout/Loader.tsx`.

## Antes de terminar cada cambio

- `npm run check` en la raíz: tipos, lint, formato, pruebas, build y tipos de `/api`.
- Mirar las páginas a 1440 y 390 px: sin errores de consola ni scroll horizontal.

## Estado

- 2026-11-17: **primera versión completa**, publicada en Vercel desde `main`.
  - Seis páginas, diseño propio, 14 fotos reales optimizadas (2,9 MB en total).
  - `/api/reservas`, `/api/contacto` y `/api/estado` probadas: validan, rechazan datos mal
    formados (400/422) y devuelven el enlace de WhatsApp.
  - 22 pruebas (horario con madrugada de viernes/sábado, horas reservables, validación,
    plantilla de WhatsApp, carta sin datos inventados).
  - Flujo de reserva probado en Chrome: errores junto a cada campo, horas válidas, mensaje
    final con la plantilla del restaurante. Menú móvil y anclas de la carta probados.
  - Pendiente: carta con platos y precios, videos, correo y Facebook.
