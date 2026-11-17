/**
 * Datos del negocio que necesitan a la vez la web (navegador) y las funciones del servidor
 * (`/api`). Este archivo y sus vecinos de `shared/` no importan nada con el alias `@/`,
 * para que las funciones de Vercel puedan usarlos tal cual.
 *
 * Fuente: enlace de reservas del Instagram @ritorooftop y ficha de Google Maps
 * (consultados el 17 de noviembre de 2026).
 */
export const NEGOCIO = {
  nombre: 'RITO Rooftop',
  zonaHoraria: 'America/Bogota',
  /** WhatsApp de reservas, solo dígitos y con el prefijo de Colombia. */
  whatsapp: '573203973011',
  /** "Las reservaciones se reciben hasta las 8:00 PM". */
  horaLimiteReserva: '20:00',
  /** "…se tiene un tiempo de 25 minutos para llegar, de lo contrario perderás la reserva." */
  toleranciaMinutos: 25,
  /** Grupos más grandes se hablan directamente por WhatsApp. */
  maxPersonas: 40,
} as const
