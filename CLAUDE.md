# Reglas del proyecto

- **Lee `CONTEXTO.md` al empezar** y actualízalo al terminar cada tarea importante.
- Habla en español sencillo: el usuario no es desarrollador experto.
- Pide permiso antes de acciones externas que no se hayan pedido: cambios de dominio o DNS.
  Un push a `main` publica en Vercel automáticamente.

## No inventar datos

Platos, precios, correo y Facebook **no existen todavía**. La carta muestra categorías reales
(sacadas del Instagram) y, mientras no haya platos, ofrece pedirla por WhatsApp. Los datos que
faltan van entre corchetes en `frontend/src/config/site.ts`. No hay fechas de fundación,
premios, pisos del edificio ni nombres de personas: no se añaden.

## Código

- Reglas que usan navegador y servidor (horario, reservas, contacto) viven en `shared/` y no
  importan nada con `@/`: las funciones de `/api` las cargan con rutas relativas.
- Colores, fuentes y espacios solo como tokens en `frontend/src/styles/globals.css`.
- `cn()` conoce la escala tipográfica propia (`text-eyebrow`, `text-h2`…): no quitar esa
  configuración o tailwind-merge borra los tamaños al juntarlos con un color.
- React 19, `<dialog>` nativo para modales, imports con `@/…`, sin archivos barril.
- Contraste mínimo 4,5:1; el latón claro (`accent`) nunca como texto sobre mármol: usar
  `accent-ink`.
- `lucide-react` v1 no trae iconos de marca: usar `AtSign`, `Globe`, `MessageCircle`.
- Fotos en WebP en `frontend/public/images/` con su versión `-sm` para celular.

## Antes de terminar

`npm run check` en la raíz y revisar las páginas a 1440 y 390 px.
