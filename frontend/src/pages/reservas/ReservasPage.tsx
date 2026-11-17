import { Clock, MapPin, MessageCircle, Timer } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { EstadoAhora } from '@/components/ui/EstadoAhora'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { mapsHref, siteConfig, whatsappHref } from '@/config/site'
import { ReservaForm } from '@/features/reserva/ReservaForm'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { HORARIO_RESUMIDO } from '@/shared/horario'
import { NEGOCIO } from '@/shared/negocio'

/** Página de reservas: el formulario y, al lado, las condiciones del propio restaurante. */
export function ReservasPage() {
  useDocumentMeta({
    title: `Reservar mesa · ${siteConfig.nameUpper} Rooftop`,
    description:
      'Reserva tu mesa en RITO Rooftop, Sogamoso: elige fecha, hora y personas y confírmala por WhatsApp. Reservas hasta las 8:00 p. m.',
  })

  return (
    <>
      <section className="relative isolate overflow-hidden bg-background pt-36 pb-16 sm:pt-44 sm:pb-20">
        <picture>
          <source media="(max-width: 700px)" srcSet="/images/salon-mural-sm.webp" />
          <img
            src="/images/salon-mural.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 size-full animate-[acercar_9s_var(--ease-luxe)_both] object-cover opacity-30 motion-reduce:animate-none"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-background/70 to-background"
        />

        <Container>
          <Eyebrow tono="amber">Reservas</Eyebrow>
          <h1 className="mt-7 max-w-3xl font-display text-display text-foreground">
            Tu mesa, <em className="texto-laton">a la altura</em>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            Elige el día, la hora y cuántos vienen. Te dejamos el mensaje listo para enviarlo por
            WhatsApp y el equipo te confirma la mesa.
          </p>
        </Container>
      </section>

      <section className="bg-background pb-24 sm:pb-28">
        <Container className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <Reveal>
            <ReservaForm />
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="lg:sticky lg:top-28">
              <h2 className="text-eyebrow text-amber uppercase">Antes de reservar</h2>
              <EstadoAhora className="mt-5 text-foreground" />

              <dl className="mt-8 space-y-7">
                <div>
                  <dt className="flex items-center gap-2.5 text-eyebrow text-muted-foreground uppercase">
                    <Timer aria-hidden="true" className="size-4 text-amber" />
                    Condiciones
                  </dt>
                  <dd className="mt-2 text-foreground">
                    Reservas hasta las 8:00 p. m. Guardamos la mesa {NEGOCIO.toleranciaMinutos}{' '}
                    minutos; después se puede asignar a otra persona.
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2.5 text-eyebrow text-muted-foreground uppercase">
                    <Clock aria-hidden="true" className="size-4 text-amber" />
                    Horario
                  </dt>
                  <dd className="mt-2 space-y-1 text-foreground">
                    {HORARIO_RESUMIDO.map((h) => (
                      <p key={h.dias}>
                        <span className="text-muted-foreground">{h.dias}:</span> {h.horas}
                      </p>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2.5 text-eyebrow text-muted-foreground uppercase">
                    <MapPin aria-hidden="true" className="size-4 text-amber" />
                    Dónde
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground underline decoration-amber/45 underline-offset-4 hover:decoration-amber"
                    >
                      {siteConfig.contact.address}, {siteConfig.contact.city}
                    </a>
                  </dd>
                </div>
              </dl>

              <p className="mt-10 border-t border-border pt-7 text-sm text-muted-foreground">
                ¿Grupo grande, cumpleaños o evento privado?{' '}
                <a
                  href={whatsappHref('Hola RITO, quisiera organizar un evento con ustedes.')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber underline decoration-amber/45 underline-offset-4 hover:decoration-amber"
                >
                  <MessageCircle aria-hidden="true" className="size-4" />
                  Escríbenos por WhatsApp
                </a>
                .
              </p>
            </aside>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
