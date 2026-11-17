import { CalendarCheck, MessageCircle } from 'lucide-react'
import { useId, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Campo, campoAlto, campoBase } from '@/components/ui/Campo'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { enviarReserva } from '@/features/reserva/reserva'
import { ahoraEnSogamoso, horaLegible, horasReservables } from '@/shared/horario'
import { NEGOCIO } from '@/shared/negocio'
import {
  fechaLegible,
  reservaVacia,
  validarReserva,
  type ErroresReserva,
  type Reserva,
} from '@/shared/reserva'
import { cn } from '@/lib/cn'

const zonas: { valor: Reserva['zona']; texto: string }[] = [
  { valor: '', texto: 'Sin preferencia' },
  { valor: 'terraza', texto: 'Terraza' },
  { valor: 'salon', texto: 'Salón' },
]

type Listo = { whatsappUrl: string; codigo: string }

/**
 * Formulario de reserva.
 *
 * Pide lo mismo que la plantilla de WhatsApp del restaurante (fecha, hora, nombre, celular
 * y personas) y solo ofrece horas reservables: desde la apertura hasta las 8:00 p. m., y si es hoy, las
 * que aún no han pasado. Al enviar, el servidor vuelve a validar y devuelve el mensaje
 * listo para mandar por WhatsApp, que es donde RITO confirma las mesas.
 */
export function ReservaForm() {
  const idBase = useId()
  const [valores, setValores] = useState<Reserva>(reservaVacia)
  const [errores, setErrores] = useState<ErroresReserva>({})
  const [aviso, setAviso] = useState<string | null>(null)
  const [listo, setListo] = useState<Listo | null>(null)
  const [enviando, setEnviando] = useState(false)
  const avisoRef = useRef<HTMLDivElement>(null)

  const hoy = ahoraEnSogamoso().fechaISO
  const horas = useMemo(() => horasReservables(valores.fecha), [valores.fecha])
  const campo = (nombre: keyof Reserva) => `${idBase}-${nombre}`

  function cambiar<K extends keyof Reserva>(nombre: K, valor: Reserva[K]) {
    setValores((previos) => {
      const siguientes = { ...previos, [nombre]: valor }
      // Si cambia la fecha y la hora elegida ya no vale para ese día, se vacía.
      if (nombre === 'fecha' && !horasReservables(String(valor)).includes(previos.hora)) {
        siguientes.hora = ''
      }
      return siguientes
    })
    setErrores((previos) => (previos[nombre] ? { ...previos, [nombre]: undefined } : previos))
  }

  function enfocarPrimerError(encontrados: ErroresReserva) {
    const primero = Object.keys(encontrados)[0] as keyof Reserva | undefined
    if (primero) document.getElementById(campo(primero))?.focus()
  }

  async function alEnviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAviso(null)
    const encontrados = validarReserva(valores)
    setErrores(encontrados)
    if (Object.keys(encontrados).length) {
      enfocarPrimerError(encontrados)
      return
    }

    setEnviando(true)
    const resultado = await enviarReserva(valores)
    setEnviando(false)

    if (resultado.estado === 'listo') {
      setListo({ whatsappUrl: resultado.whatsappUrl, codigo: resultado.codigo })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (resultado.estado === 'invalida') {
      setErrores(resultado.errores)
      enfocarPrimerError(resultado.errores)
    } else {
      setAviso(resultado.mensaje)
      avisoRef.current?.scrollIntoView({ block: 'nearest' })
    }
  }

  if (listo) {
    return (
      <div className="rounded-sm bg-surface p-8 ring-1 ring-border sm:p-12" role="status">
        <Eyebrow tono="amber">Último paso</Eyebrow>
        <p className="mt-6 font-display text-h3 text-foreground">
          {valores.nombre.split(' ')[0]}, tu solicitud está lista.
        </p>
        <p className="mt-4 text-muted-foreground">
          Envíala por WhatsApp y el equipo de RITO te confirma la mesa por ahí mismo. Hasta que te
          respondan, la reserva no está confirmada.
        </p>

        <dl className="mt-8 grid gap-4 border-y border-border py-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Día</dt>
            <dd className="mt-1 text-foreground first-letter:uppercase">
              {fechaLegible(valores.fecha)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Hora</dt>
            <dd className="mt-1 text-foreground">{horaLegible(valores.hora)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Personas</dt>
            <dd className="mt-1 text-foreground">{valores.personas}</dd>
          </div>
          {listo.codigo ? (
            <div>
              <dt className="text-muted-foreground">Código de solicitud</dt>
              <dd className="tabular mt-1 text-amber">{listo.codigo}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={listo.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-13 min-h-11 items-center justify-center gap-3 rounded-xs bg-accent px-8 text-[0.75rem] font-semibold tracking-[0.2em] text-accent-foreground uppercase transition-colors duration-300 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            Enviar por WhatsApp
          </a>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setListo(null)
              setValores(reservaVacia)
            }}
          >
            Hacer otra
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground/90">
          Recuerda: tenemos {NEGOCIO.toleranciaMinutos} minutos de espera. Si llegas después, la
          mesa puede asignarse a otra persona.
        </p>
      </div>
    )
  }

  const sinHoras = valores.fecha !== '' && horas.length === 0

  return (
    <form
      noValidate
      onSubmit={alEnviar}
      className="rounded-sm bg-surface p-6 ring-1 ring-border sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id={campo('fecha')} etiqueta="Fecha" error={errores.fecha}>
          {(props) => (
            <input
              {...props}
              type="date"
              name="fecha"
              min={hoy}
              className={cn(campoBase, campoAlto, '[color-scheme:dark]')}
              value={valores.fecha}
              onChange={(e) => cambiar('fecha', e.target.value)}
            />
          )}
        </Campo>

        <Campo
          id={campo('hora')}
          etiqueta="Hora"
          error={
            errores.hora ??
            (sinHoras ? 'Para hoy ya pasó la hora límite de reservas (8:00 p. m.).' : undefined)
          }
          ayuda={valores.fecha ? undefined : 'Elige primero la fecha.'}
        >
          {(props) => (
            <select
              {...props}
              name="hora"
              disabled={!valores.fecha || sinHoras}
              className={cn(campoBase, campoAlto, 'cursor-pointer disabled:cursor-not-allowed')}
              value={valores.hora}
              onChange={(e) => cambiar('hora', e.target.value)}
            >
              <option value="">Selecciona</option>
              {horas.map((h) => (
                <option key={h} value={h}>
                  {horaLegible(h)}
                </option>
              ))}
            </select>
          )}
        </Campo>

        <Campo id={campo('nombre')} etiqueta="Nombre" error={errores.nombre}>
          {(props) => (
            <input
              {...props}
              type="text"
              name="nombre"
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
              name="celular"
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
          id={campo('personas')}
          etiqueta="Número de personas"
          error={errores.personas}
          ayuda={`Más de ${NEGOCIO.maxPersonas}: escríbenos por WhatsApp.`}
        >
          {(props) => (
            <input
              {...props}
              type="number"
              name="personas"
              min={1}
              max={NEGOCIO.maxPersonas}
              inputMode="numeric"
              className={cn(campoBase, campoAlto)}
              value={valores.personas}
              onChange={(e) => cambiar('personas', e.target.value)}
            />
          )}
        </Campo>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-eyebrow text-muted-foreground uppercase">Zona preferida</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {zonas.map((z) => (
              <label
                key={z.valor || 'ninguna'}
                className={cn(
                  'flex min-h-12 cursor-pointer items-center justify-center rounded-xs border px-2 text-center text-sm transition-colors duration-200',
                  'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-amber',
                  valores.zona === z.valor
                    ? 'border-accent bg-accent/12 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                <input
                  type="radio"
                  name="zona"
                  value={z.valor}
                  checked={valores.zona === z.valor}
                  onChange={() => cambiar('zona', z.valor)}
                  className="sr-only"
                />
                {z.texto}
              </label>
            ))}
          </div>
          <p className="text-sm text-muted-foreground/80">Según disponibilidad y el clima.</p>
        </fieldset>

        <Campo
          id={campo('ocasion')}
          etiqueta="Ocasión (opcional)"
          error={errores.ocasion}
          className="sm:col-span-2"
        >
          {(props) => (
            <input
              {...props}
              type="text"
              name="ocasion"
              maxLength={60}
              placeholder="Cumpleaños, aniversario, reunión de trabajo…"
              className={cn(campoBase, campoAlto)}
              value={valores.ocasion}
              onChange={(e) => cambiar('ocasion', e.target.value)}
            />
          )}
        </Campo>

        <Campo
          id={campo('notas')}
          etiqueta="Notas (opcional)"
          error={errores.notas}
          className="sm:col-span-2"
        >
          {(props) => (
            <textarea
              {...props}
              name="notas"
              rows={3}
              maxLength={400}
              placeholder="Alergias, silla para bebé, una sorpresa que debamos saber…"
              className={cn(campoBase, 'py-3')}
              value={valores.notas}
              onChange={(e) => cambiar('notas', e.target.value)}
            />
          )}
        </Campo>
      </div>

      <div className="mt-8 border-t border-border pt-7">
        <div className="flex items-start gap-3">
          <input
            id={campo('acepta')}
            type="checkbox"
            name="acepta"
            checked={valores.acepta}
            aria-invalid={errores.acepta ? true : undefined}
            aria-describedby={errores.acepta ? `${campo('acepta')}-error` : undefined}
            onChange={(e) => cambiar('acepta', e.target.checked)}
            className="mt-1 size-5 shrink-0 cursor-pointer accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
          />
          <label htmlFor={campo('acepta')} className="cursor-pointer text-sm text-muted-foreground">
            Entiendo que la reserva se confirma por WhatsApp y que la mesa se guarda{' '}
            {NEGOCIO.toleranciaMinutos} minutos después de la hora elegida.
          </label>
        </div>
        {errores.acepta ? (
          <p id={`${campo('acepta')}-error`} className="mt-3 text-sm font-medium text-error">
            {errores.acepta}
          </p>
        ) : null}
      </div>

      <div ref={avisoRef} role="status" aria-live="polite">
        {aviso ? (
          <p className="mt-8 rounded-xs border border-error/40 bg-error/10 p-5 text-error">
            {aviso}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="mt-8" disabled={enviando}>
        <CalendarCheck aria-hidden="true" className="size-5" />
        {enviando ? 'Preparando…' : 'Preparar reserva'}
      </Button>
    </form>
  )
}
