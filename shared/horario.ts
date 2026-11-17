import { NEGOCIO } from "./negocio";

/**
 * Horario de atención, de la ficha de Google Maps. El índice es el día de la semana de
 * JavaScript (0 = domingo). Un cierre menor que la apertura significa "pasada la
 * medianoche": viernes y sábado se cierra a las 2 a. m. del día siguiente.
 */
export type Franja = { abre: string; cierra: string };

export const HORARIO: readonly Franja[] = [
  { abre: "12:00", cierra: "22:00" }, // domingo
  { abre: "12:00", cierra: "23:00" }, // lunes
  { abre: "12:00", cierra: "23:00" }, // martes
  { abre: "12:00", cierra: "23:00" }, // miércoles
  { abre: "12:00", cierra: "23:00" }, // jueves
  { abre: "12:00", cierra: "02:00" }, // viernes
  { abre: "12:00", cierra: "02:00" }, // sábado
];

export const NOMBRES_DIA = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
] as const;

/** Horario agrupado para mostrarlo en pantalla. */
export const HORARIO_RESUMIDO = [
  { dias: "Lunes a jueves", horas: "12:00 m. – 11:00 p. m." },
  { dias: "Viernes y sábado", horas: "12:00 m. – 2:00 a. m." },
  { dias: "Domingo", horas: "12:00 m. – 10:00 p. m." },
] as const;

/** "20:30" → 1230 minutos desde la medianoche. */
export function aMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** 1230 → "8:30 p. m.", como se escribe la hora en Colombia. */
export function horaLegible(hora: string) {
  const total = aMinutos(hora);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  const sufijo = h === 12 && m === 0 ? "m." : h < 12 ? "a. m." : "p. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/** Fecha y hora "de pared" en Sogamoso, sea cual sea la zona del aparato o del servidor. */
export function ahoraEnSogamoso(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: NEGOCIO.zonaHoraria,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(fecha);
  const valor = (tipo: string) =>
    partes.find((p) => p.type === tipo)?.value ?? "";
  const dias = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    fechaISO: `${valor("year")}-${valor("month")}-${valor("day")}`,
    dia: dias.indexOf(valor("weekday")),
    minutos: Number(valor("hour")) * 60 + Number(valor("minute")),
  };
}

/** Día de la semana (0 = domingo) de una fecha `aaaa-mm-dd`, sin depender de la zona horaria. */
export function diaDeSemana(fechaISO: string) {
  const [a, m, d] = fechaISO.split("-").map(Number);
  return new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1, d ?? 1)).getUTCDay();
}

export type EstadoLocal = { abierto: boolean; texto: string };

/** ¿Está abierto ahora? Tiene en cuenta la madrugada del viernes y del sábado. */
export function estadoAhora(fecha = new Date()): EstadoLocal {
  const { dia, minutos } = ahoraEnSogamoso(fecha);
  const hoy = HORARIO[dia]!;
  const ayer = HORARIO[(dia + 6) % 7]!;

  // Madrugada: sigue abierto si ayer cerraba pasada la medianoche.
  if (
    aMinutos(ayer.cierra) < aMinutos(ayer.abre) &&
    minutos < aMinutos(ayer.cierra)
  ) {
    return {
      abierto: true,
      texto: `Abierto · cierra a las ${horaLegible(ayer.cierra)}`,
    };
  }

  const abre = aMinutos(hoy.abre);
  const cruzaMedianoche = aMinutos(hoy.cierra) < abre;
  const cierra = cruzaMedianoche
    ? aMinutos(hoy.cierra) + 24 * 60
    : aMinutos(hoy.cierra);

  if (minutos >= abre && minutos < cierra) {
    return {
      abierto: true,
      texto: `Abierto · cierra a las ${horaLegible(hoy.cierra)}`,
    };
  }
  if (minutos < abre) {
    return {
      abierto: false,
      texto: `Cerrado · abre hoy a las ${horaLegible(hoy.abre)}`,
    };
  }
  const manana = HORARIO[(dia + 1) % 7]!;
  return {
    abierto: false,
    texto: `Cerrado · abre mañana a las ${horaLegible(manana.abre)}`,
  };
}

/**
 * Horas que se pueden pedir para una fecha: cada 30 minutos desde la apertura hasta la hora
 * límite de reservas (8:00 p. m.) o el cierre, lo que llegue antes. Si la fecha es hoy, solo
 * las que aún no han pasado.
 */
export function horasReservables(fechaISO: string, ahora = new Date()) {
  if (!fechaISO) return [];
  const franja = HORARIO[diaDeSemana(fechaISO)];
  if (!franja) return [];

  const inicio = aMinutos(franja.abre);
  const cierre =
    aMinutos(franja.cierra) < inicio
      ? aMinutos(franja.cierra) + 1440
      : aMinutos(franja.cierra);
  const fin = Math.min(aMinutos(NEGOCIO.horaLimiteReserva), cierre);

  const local = ahoraEnSogamoso(ahora);
  const minimo = local.fechaISO === fechaISO ? local.minutos + 30 : 0;

  const horas: string[] = [];
  for (let t = inicio; t <= fin; t += 30) {
    if (t < minimo) continue;
    horas.push(
      `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`,
    );
  }
  return horas;
}
