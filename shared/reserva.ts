import { horaLegible, horasReservables, ahoraEnSogamoso } from './horario'
import { NEGOCIO } from './negocio'

/**
 * Una solicitud de reserva. Los campos son los mismos que pide el restaurante en su
 * plantilla de WhatsApp (fecha, hora, nombre, celular y número de personas), más un
 * motivo y unas notas opcionales.
 */
export type Reserva = {
  nombre: string
  celular: string
  fecha: string
  hora: string
  personas: string
  zona: '' | 'terraza' | 'salon'
  ocasion: string
  notas: string
  /** Confirmación explícita de las condiciones antes de enviar. */
  acepta: boolean
}

export const reservaVacia: Reserva = {
  nombre: '',
  celular: '',
  fecha: '',
  hora: '',
  personas: '2',
  zona: '',
  ocasion: '',
  notas: '',
  acepta: false,
}

export type ErroresReserva = Partial<Record<keyof Reserva, string>>

const LIMITE_TEXTO = 400

/**
 * Validación compartida: la usa el formulario en el navegador y la repite la función
 * `/api/reservas` en el servidor (nunca hay que fiarse solo del navegador).
 * Los mensajes son concretos y van junto a cada campo.
 */
export function validarReserva(r: Reserva, ahora = new Date()): ErroresReserva {
  const errores: ErroresReserva = {}
  const hoy = ahoraEnSogamoso(ahora).fechaISO

  if (typeof r.nombre !== 'string' || r.nombre.trim().length < 2) {
    errores.nombre = 'Escribe tu nombre.'
  } else if (r.nombre.length > 80) {
    errores.nombre = 'El nombre es demasiado largo.'
  }

  const digitos = String(r.celular ?? '').replace(/[\s()+-]/g, '')
  if (!/^\d{10,12}$/.test(digitos)) {
    errores.celular = 'Escribe un celular de 10 cifras, por ejemplo 300 123 4567.'
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(r.fecha ?? ''))) {
    errores.fecha = 'Elige la fecha.'
  } else if (r.fecha < hoy) {
    errores.fecha = 'La fecha ya pasó: elige hoy o un día posterior.'
  }

  if (!errores.fecha) {
    if (!r.hora) {
      errores.hora = 'Elige la hora.'
    } else if (!horasReservables(r.fecha, ahora).includes(r.hora)) {
      errores.hora =
        r.fecha === hoy
          ? `Para hoy ya no está disponible esa hora. Las reservas se reciben hasta las ${horaLegible(NEGOCIO.horaLimiteReserva)}`
          : `Elige una hora entre la apertura y las ${horaLegible(NEGOCIO.horaLimiteReserva)}`
    }
  }

  const personas = Number(r.personas)
  if (!Number.isInteger(personas) || personas < 1 || personas > NEGOCIO.maxPersonas) {
    errores.personas = `Indica entre 1 y ${NEGOCIO.maxPersonas} personas. Para grupos mayores, escríbenos.`
  }

  if (r.zona !== '' && r.zona !== 'terraza' && r.zona !== 'salon') {
    errores.zona = 'Elige terraza, salón o sin preferencia.'
  }

  if (String(r.ocasion ?? '').length > 60) errores.ocasion = 'Resume la ocasión en pocas palabras.'
  if (String(r.notas ?? '').length > LIMITE_TEXTO) {
    errores.notas = `Las notas no pueden pasar de ${LIMITE_TEXTO} caracteres.`
  }

  if (r.acepta !== true) {
    errores.acepta = 'Marca la casilla para confirmar que conoces las condiciones.'
  }

  return errores
}

/** "2026-11-28" → "sábado 28 de noviembre". */
export function fechaLegible(fechaISO: string) {
  const [a, m, d] = fechaISO.split('-').map(Number)
  const fecha = new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1, d ?? 1, 12))
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(fecha)
}

const ZONAS = {
  terraza: 'Terraza',
  salon: 'Salón',
  '': 'Sin preferencia',
} as const

/**
 * El mensaje que llega al WhatsApp del restaurante, con los mismos campos y el mismo orden
 * de su propia plantilla, para que lo puedan leer de un vistazo.
 */
export function mensajeWhatsApp(r: Reserva) {
  const lineas = [
    `Hola ${NEGOCIO.nombre}, quiero reservar una mesa:`,
    '',
    `🗓️ *FECHA:* ${fechaLegible(r.fecha)}`,
    `⏰ *HORA:* ${horaLegible(r.hora)}`,
    `🎎 *NOMBRE:* ${r.nombre.trim()}`,
    `📱 *CELULAR:* ${r.celular.trim()}`,
    `👨‍👩‍👧‍👧 *# PERSONAS:* ${Number(r.personas)}`,
    `📍 *ZONA:* ${ZONAS[r.zona] ?? ZONAS['']}`,
  ]
  if (r.ocasion.trim()) lineas.push(`✨ *OCASIÓN:* ${r.ocasion.trim()}`)
  if (r.notas.trim()) lineas.push(`📝 *NOTAS:* ${r.notas.trim()}`)
  lineas.push('', 'Enviado desde la web de RITO.')
  return lineas.join('\n')
}

export function enlaceWhatsApp(mensaje: string) {
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`
}
