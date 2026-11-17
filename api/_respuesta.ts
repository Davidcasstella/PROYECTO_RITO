/**
 * Utilidades comunes de las funciones del servidor. El guion bajo del nombre hace que
 * Vercel no lo publique como ruta (`/api/_respuesta` no existe).
 */

/** Respuesta JSON sin caché: cada solicitud es distinta. */
export function json(cuerpo: unknown, estado = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

/** Tamaño máximo del cuerpo aceptado: un formulario no necesita más. */
const MAX_BYTES = 8 * 1024

/**
 * Lee el cuerpo JSON con límites: tipo de contenido, tamaño y que sea un objeto.
 * Devuelve `null` si algo no cuadra; quien llama responde 400.
 */
export async function leerJson(request: Request): Promise<Record<string, unknown> | null> {
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return null
  const texto = await request.text()
  if (texto.length > MAX_BYTES) return null
  try {
    const datos: unknown = JSON.parse(texto)
    return datos && typeof datos === 'object' && !Array.isArray(datos)
      ? (datos as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

/** Texto de un campo, recortado; cualquier otra cosa se convierte en cadena vacía. */
export function texto(valor: unknown, max = 1000) {
  return typeof valor === 'string' ? valor.slice(0, max) : ''
}

/**
 * Reenvío opcional a un servicio externo (Make, Zapier, n8n, Google Apps Script…) para
 * guardar las solicitudes en una hoja o avisar por correo. Solo se activa si en Vercel se
 * define la variable de entorno indicada. Si falla, no bloquea al cliente: el mensaje de
 * WhatsApp sigue siendo el canal principal.
 */
export async function reenviar(variable: string, datos: unknown) {
  const url = process.env[variable]
  if (!url) return false
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      signal: AbortSignal.timeout(4000),
    })
    return r.ok
  } catch {
    return false
  }
}
