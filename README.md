# RITO Rooftop · Gastrobar & Terraza

Sitio web de RITO, rooftop en Sogamoso (Boyacá): cócteles, cortes, vino y la terraza sobre la
plaza. Reservas por WhatsApp con validación en el servidor.

## Iniciar

Requiere Node 22 o superior.

```sh
npm install
npm run dev      # sitio en local (las funciones /api solo corren en Vercel o con `vercel dev`)
npm run check    # tipos, lint, formato, pruebas y build
```

## Qué hay dentro

- `frontend/`: React 19 + TypeScript + Vite + Tailwind 4 + Motion.
- `api/`: funciones de Vercel. `POST /api/reservas`, `POST /api/contacto`, `GET /api/estado`.
- `shared/`: reglas comunes (horario, horas reservables, validaciones, mensaje de WhatsApp).
- `scripts/video-a-fotogramas.mjs`: prepara los videos para el recorrido por scroll.

## Editar contenido

| Qué                        | Dónde                                               |
| -------------------------- | --------------------------------------------------- |
| Dirección, WhatsApp, redes | `frontend/src/config/site.ts` y `shared/negocio.ts` |
| Horario                    | `shared/horario.ts`                                 |
| Platos y precios           | `frontend/src/features/menu/menu.ts`                |
| Eventos de la agenda       | `frontend/src/features/agenda/agenda.ts`            |
| Fotos de la galería        | `frontend/src/features/galeria/galeria.ts`          |

## Publicación

Vercel está conectado al repositorio: cada push a `main` se publica solo. La configuración está
en `vercel.json` (compila `frontend`, publica `frontend/dist` y sirve `/api`).

Más detalle en `CONTEXTO.md`.
