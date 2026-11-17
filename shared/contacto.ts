/** Mensaje del formulario de contacto. Validación compartida con `/api/contacto`. */
export type MensajeContacto = {
  nombre: string;
  celular: string;
  asunto: "evento" | "informacion" | "otro";
  mensaje: string;
};

export const mensajeVacio: MensajeContacto = {
  nombre: "",
  celular: "",
  asunto: "informacion",
  mensaje: "",
};

export type ErroresContacto = Partial<Record<keyof MensajeContacto, string>>;

export const ASUNTOS: Record<MensajeContacto["asunto"], string> = {
  evento: "Evento o celebración",
  informacion: "Información general",
  otro: "Otro tema",
};

export function validarContacto(m: MensajeContacto): ErroresContacto {
  const errores: ErroresContacto = {};
  if (typeof m.nombre !== "string" || m.nombre.trim().length < 2)
    errores.nombre = "Escribe tu nombre.";
  const digitos = String(m.celular ?? "").replace(/[\s()+-]/g, "");
  if (!/^\d{10,12}$/.test(digitos))
    errores.celular = "Escribe un celular de 10 cifras.";
  if (!(m.asunto in ASUNTOS)) errores.asunto = "Elige un asunto.";
  const texto = String(m.mensaje ?? "").trim();
  if (texto.length < 10)
    errores.mensaje = "Cuéntanos un poco más (al menos 10 caracteres).";
  else if (texto.length > 1000)
    errores.mensaje = "El mensaje no puede pasar de 1000 caracteres.";
  return errores;
}

export function mensajeContactoWhatsApp(m: MensajeContacto) {
  return [
    `Hola RITO, les escribo desde la web.`,
    "",
    `*Asunto:* ${ASUNTOS[m.asunto]}`,
    `*Nombre:* ${m.nombre.trim()}`,
    `*Celular:* ${m.celular.trim()}`,
    "",
    m.mensaje.trim(),
  ].join("\n");
}
