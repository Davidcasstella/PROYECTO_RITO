import { MessageCircle, Send } from 'lucide-react'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Campo, campoAlto, campoBase } from '@/components/ui/Campo'
import { Eyebrow } from '@/components/ui/Eyebrow'
import {
  ASUNTOS,
  mensajeContactoWhatsApp,
  mensajeVacio,
  validarContacto,
  type ErroresContacto,
  type MensajeContacto,
} from '@/shared/contacto'
import { enlaceWhatsApp } from '@/shared/reserva'
import { cn } from '@/lib/cn'

/**
 * Pide el enlace a `/api/contacto`, que vuelve a validar el mensaje. Si la función no está
 * disponible (desarrollo local), se arma el mismo enlace en el navegador.
 */
async function prepararMensaje(m: MensajeContacto) {
  try {
    const r = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(m),
    })
    if (!(r.headers.get('content-type') ?? '').includes('application/json')) throw new Error()
    const datos = (await r.json()) as
      { ok: true; whatsappUrl: string } | { ok: false; errores: ErroresContacto }
    return datos
  } catch {
    return { ok: true as const, whatsappUrl: enlaceWhatsApp(mensajeContactoWhatsApp(m)) }
  }
}

/**
 * Formulario de contacto. RITO atiende por WhatsApp, así que el mensaje no se "envía" a un
 * buzón invisible: se deja escrito y listo para mandarlo por WhatsApp con un toque.
 */
export function ContactoForm() {
  const idBase = useId()
  const [valores, setValores] = useState<MensajeContacto>(mensajeVacio)
  const [errores, setErrores] = useState<ErroresContacto>({})
  const [enlace, setEnlace] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const campo = (n: keyof MensajeContacto) => `${idBase}-${n}`

  function cambiar<K extends keyof MensajeContacto>(nombre: K, valor: MensajeContacto[K]) {
    setValores((p) => ({ ...p, [nombre]: valor }))
    setErrores((p) => (p[nombre] ? { ...p, [nombre]: undefined } : p))
  }

  async function alEnviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const encontrados = validarContacto(valores)
    setErrores(encontrados)
    const primero = Object.keys(encontrados)[0] as keyof MensajeContacto | undefined
    if (primero) {
      document.getElementById(campo(primero))?.focus()
      return
    }
    setEnviando(true)
    const respuesta = await prepararMensaje(valores)
    setEnviando(false)
    if (respuesta.ok) setEnlace(respuesta.whatsappUrl)
    else setErrores(respuesta.errores)
  }

  if (enlace) {
    return (
      <div className="rounded-sm bg-surface p-8 ring-1 ring-border sm:p-10" role="status">
        <Eyebrow tono="amber">Mensaje listo</Eyebrow>
        <p className="mt-5 font-display text-h3 text-foreground">
          Gracias, {valores.nombre.split(' ')[0]}.
        </p>
        <p className="mt-3 text-muted-foreground">
          Envíalo por WhatsApp y te respondemos por ahí mismo.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={enlace}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 min-h-11 items-center gap-3 rounded-xs bg-accent px-7 text-[0.72rem] font-semibold tracking-[0.2em] text-accent-foreground uppercase transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            Enviar por WhatsApp
          </a>
          <Button
            variant="outline"
            onClick={() => {
              setEnlace(null)
              setValores(mensajeVacio)
            }}
          >
            Escribir otro
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={alEnviar}
      className="rounded-sm bg-surface p-6 ring-1 ring-border sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id={campo('nombre')} etiqueta="Nombre" error={errores.nombre}>
          {(props) => (
            <input
              {...props}
              type="text"
              autoComplete="name"
              maxLength={80}
              className={cn(campoBase, campoAlto)}
              value={valores.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)}
            />
          )}
        </Campo>

        <Campo id={campo('celular')} etiqueta="Celular" error={errores.celular}>
          {(props) => (
            <input
              {...props}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="300 123 4567"
              className={cn(campoBase, campoAlto)}
              value={valores.celular}
              onChange={(e) => cambiar('celular', e.target.value)}
            />
          )}
        </Campo>

        <Campo
          id={campo('asunto')}
          etiqueta="Asunto"
          error={errores.asunto}
          className="sm:col-span-2"
        >
          {(props) => (
            <select
              {...props}
              className={cn(campoBase, campoAlto, 'cursor-pointer')}
              value={valores.asunto}
              onChange={(e) => cambiar('asunto', e.target.value as MensajeContacto['asunto'])}
            >
              {Object.entries(ASUNTOS).map(([valor, texto]) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
          )}
        </Campo>

        <Campo
          id={campo('mensaje')}
          etiqueta="Mensaje"
          error={errores.mensaje}
          className="sm:col-span-2"
        >
          {(props) => (
            <textarea
              {...props}
              rows={5}
              maxLength={1000}
              placeholder="Cuéntanos qué necesitas: fecha, número de personas, tipo de evento…"
              className={cn(campoBase, 'py-3')}
              value={valores.mensaje}
              onChange={(e) => cambiar('mensaje', e.target.value)}
            />
          )}
        </Campo>
      </div>

      <Button type="submit" size="lg" className="mt-8" disabled={enviando}>
        <Send aria-hidden="true" className="size-4" />
        {enviando ? 'Preparando…' : 'Preparar mensaje'}
      </Button>
    </form>
  )
}
