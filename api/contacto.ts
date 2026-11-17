import {
  ASUNTOS,
  mensajeContactoWhatsApp,
  validarContacto,
  type MensajeContacto,
} from '../shared/contacto'
import { enlaceWhatsApp } from '../shared/reserva'
import { json, leerJson, reenviar, texto } from './_respuesta'

/**
 * POST /api/contacto
 *
 * Valida el mensaje del formulario de contacto y devuelve el enlace de WhatsApp listo.
 * Con `CONTACTO_WEBHOOK_URL` definida en Vercel, además lo reenvía a ese servicio.
 */
export async function POST(request: Request) {
  const datos = await leerJson(request)
  if (!datos) return json({ ok: false, mensaje: 'La solicitud no tiene el formato esperado.' }, 400)

  const asunto = texto(datos.asunto, 20)
  const mensaje: MensajeContacto = {
    nombre: texto(datos.nombre, 80),
    celular: texto(datos.celular, 20),
    asunto: (asunto in ASUNTOS ? asunto : 'otro') as MensajeContacto['asunto'],
    mensaje: texto(datos.mensaje, 1000),
  }

  const errores = validarContacto(mensaje)
  if (Object.keys(errores).length > 0) return json({ ok: false, errores }, 422)

  await reenviar('CONTACTO_WEBHOOK_URL', {
    tipo: 'contacto',
    recibido: new Date().toISOString(),
    ...mensaje,
  })

  return json({
    ok: true,
    whatsappUrl: enlaceWhatsApp(mensajeContactoWhatsApp(mensaje)),
  })
}

export function GET() {
  return new Response('Usa POST.', { status: 405, headers: { Allow: 'POST' } })
}
