import {
  HORARIO_RESUMIDO,
  estadoAhora,
  horasReservables,
  ahoraEnSogamoso,
} from "../shared/horario";
import { NEGOCIO } from "../shared/negocio";
import { json } from "./_respuesta";

/**
 * GET /api/estado
 *
 * ¿Está abierto RITO ahora mismo? Con la hora de Sogamoso, el horario y las horas que
 * todavía se pueden reservar hoy. Útil para integraciones (un bot, otra web, un panel).
 */
export function GET() {
  const ahora = new Date();
  const hoy = ahoraEnSogamoso(ahora).fechaISO;
  return json({
    negocio: NEGOCIO.nombre,
    ...estadoAhora(ahora),
    horario: HORARIO_RESUMIDO,
    reservas: {
      horaLimite: NEGOCIO.horaLimiteReserva,
      toleranciaMinutos: NEGOCIO.toleranciaMinutos,
      horasDisponiblesHoy: horasReservables(hoy, ahora),
    },
  });
}
