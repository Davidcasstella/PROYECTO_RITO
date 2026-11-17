import {
  enlaceWhatsApp,
  mensajeWhatsApp,
  type ErroresReserva,
  type Reserva,
} from '@/shared/reserva'

export type ResultadoReserva =
  | { estado: 'listo'; whatsappUrl: string; codigo: string }
  | { estado: 'invalida'; errores: ErroresReserva }
  | { estado: 'error'; mensaje: string }

/**
 * Envía la solicitud a la función del servidor `/api/reservas`, que vuelve a validarla
 * (fecha, hora dentro del horario, hasta las 8:00 p. m.), le da un código y devuelve el
 * enlace de WhatsApp con el mensaje ya escrito.
 *
 * La reserva NO queda confirmada aquí: el restaurante la confirma por WhatsApp, como ya
 * hace hoy. Si el servidor no responde (por ejemplo, en desarrollo local con `vite`, donde
 * no corren las funciones), se arma el mismo enlace en el navegador para no bloquear a nadie.
 */
export async function enviarReserva(reserva: Reserva): Promise<ResultadoReserva> {
  try {
    const respuesta = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(reserva),
    })

    const tipo = respuesta.headers.get('content-type') ?? ''
    if (!tipo.includes('application/json')) throw new Error('sin-servidor')

    const datos = (await respuesta.json()) as
      | { ok: true; whatsappUrl: string; codigo: string }
      | { ok: false; errores?: ErroresReserva; mensaje?: string }

    if (datos.ok) return { estado: 'listo', whatsappUrl: datos.whatsappUrl, codigo: datos.codigo }
    if (datos.errores) return { estado: 'invalida', errores: datos.errores }
    return { estado: 'error', mensaje: datos.mensaje ?? 'No pudimos preparar la reserva.' }
  } catch {
    return {
      estado: 'listo',
      whatsappUrl: enlaceWhatsApp(mensajeWhatsApp(reserva)),
      codigo: '',
    }
  }
}
