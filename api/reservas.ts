import {
  enlaceWhatsApp,
  mensajeWhatsApp,
  validarReserva,
  type Reserva,
} from "../shared/reserva";
import { json, leerJson, reenviar, texto } from "./_respuesta";

/**
 * POST /api/reservas
 *
 * Recibe la solicitud del formulario, la vuelve a validar con las mismas reglas que el
 * navegador (nunca hay que fiarse solo del cliente), le asigna un código corto y devuelve
 * el enlace de WhatsApp con el mensaje en el formato del restaurante.
 *
 * La reserva se confirma por WhatsApp, como RITO ya trabaja hoy. Si se define la variable
 * `RESERVAS_WEBHOOK_URL` en Vercel, además se reenvía la solicitud a ese servicio (por
 * ejemplo, para guardarla en una hoja de cálculo).
 */
export async function POST(request: Request) {
  const datos = await leerJson(request);
  if (!datos)
    return json(
      { ok: false, mensaje: "La solicitud no tiene el formato esperado." },
      400,
    );

  const zona = texto(datos.zona, 10);
  const reserva: Reserva = {
    nombre: texto(datos.nombre, 80),
    celular: texto(datos.celular, 20),
    fecha: texto(datos.fecha, 10),
    hora: texto(datos.hora, 5),
    personas: texto(String(datos.personas ?? ""), 3),
    zona: (zona === "terraza" || zona === "salon"
      ? zona
      : "") as Reserva["zona"],
    ocasion: texto(datos.ocasion, 60),
    notas: texto(datos.notas, 400),
    acepta: datos.acepta === true,
  };

  const errores = validarReserva(reserva);
  if (Object.keys(errores).length > 0) return json({ ok: false, errores }, 422);

  const codigo = `R-${Date.now().toString(36).slice(-5).toUpperCase()}`;
  const mensaje = `${mensajeWhatsApp(reserva)}\n🔖 Código: ${codigo}`;

  await reenviar("RESERVAS_WEBHOOK_URL", {
    tipo: "reserva",
    codigo,
    recibida: new Date().toISOString(),
    ...reserva,
  });

  return json({ ok: true, codigo, whatsappUrl: enlaceWhatsApp(mensaje) });
}

/** Cualquier otro método: 405, con la cabecera que indica cuál se admite. */
export function GET() {
  return new Response("Usa POST.", { status: 405, headers: { Allow: "POST" } });
}
