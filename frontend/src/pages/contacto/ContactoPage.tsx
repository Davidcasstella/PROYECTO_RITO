import { AtSign, Clock, MapPin, MessageCircle, Navigation } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { EstadoAhora } from '@/components/ui/EstadoAhora'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { mapsHref, siteConfig, whatsappHref } from '@/config/site'
import { ContactoForm } from '@/features/contacto/ContactoForm'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { HORARIO_RESUMIDO } from '@/shared/horario'

const { contact } = siteConfig

const enlace =
  'inline-flex min-h-11 items-center transition-colors duration-300 hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber'

/** Contacto: dirección, horario, WhatsApp, Instagram, mapa y formulario. */
export function ContactoPage() {
  useDocumentMeta({
    title: `Contacto · ${siteConfig.nameUpper} Rooftop`,
    description:
      'Cómo llegar a RITO Cocina Rooftop: Carrera 10 # 12-08, piso 3, Sogamoso. Horario, WhatsApp 320 397 3011, correo e Instagram @ritorooftop.',
  })

  return (
    <>
      <section className="relative isolate overflow-hidden bg-background pt-36 pb-16 sm:pt-44 sm:pb-20">
        <picture>
          <source media="(max-width: 700px)" srcSet="/images/vista-palmeras-sm.webp" />
          <img
            src="/images/vista-palmeras.webp"
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
          <Eyebrow tono="amber">Contacto</Eyebrow>
          <h1 className="mt-7 max-w-3xl font-display text-display text-foreground">
            Te esperamos <em className="texto-laton">arriba</em>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            En la Carrera 10, frente a la plaza. Escríbenos por WhatsApp o deja tu mensaje y te
            respondemos.
          </p>
          <EstadoAhora className="mt-8 text-foreground" />
        </Container>
      </section>

      <section className="bg-background pb-24 sm:pb-28">
        <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <dl className="grid gap-8 sm:grid-cols-2">
              <div className="border-l border-accent/40 pl-5">
                <dt className="flex items-center gap-2.5 text-eyebrow text-muted-foreground uppercase">
                  <MapPin aria-hidden="true" className="size-4 text-amber" />
                  Dirección
                </dt>
                <dd className="mt-2 text-foreground">
                  <a href={mapsHref} target="_blank" rel="noreferrer" className={enlace}>
                    {contact.address}
                    <br />
                    {contact.city}
                  </a>
                </dd>
              </div>

              <div className="border-l border-accent/40 pl-5">
                <dt className="flex items-center gap-2.5 text-eyebrow text-muted-foreground uppercase">
                  <MessageCircle aria-hidden="true" className="size-4 text-amber" />
                  WhatsApp
                </dt>
                <dd className="mt-2 text-foreground">
                  <a href={whatsappHref()} target="_blank" rel="noreferrer" className={enlace}>
                    {contact.phone}
                  </a>
                </dd>
              </div>

              <div className="border-l border-accent/40 pl-5">
                <dt className="flex items-center gap-2.5 text-eyebrow text-muted-foreground uppercase">
                  <Clock aria-hidden="true" className="size-4 text-amber" />
                  Horario
                </dt>
                <dd className="mt-2 space-y-1.5 text-foreground">
                  {HORARIO_RESUMIDO.map((h) => (
                    <p key={h.dias}>
                      <span className="block text-sm text-muted-foreground">{h.dias}</span>
                      {h.horas}
                    </p>
                  ))}
                </dd>
              </div>

              <div className="border-l border-accent/40 pl-5">
                <dt className="flex items-center gap-2.5 text-eyebrow text-muted-foreground uppercase">
                  <AtSign aria-hidden="true" className="size-4 text-amber" />
                  Instagram
                </dt>
                <dd className="mt-2 text-foreground">
                  <a href={contact.instagram} target="_blank" rel="noreferrer" className={enlace}>
                    {contact.instagramUser}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-12 overflow-hidden rounded-sm ring-1 ring-border">
              <iframe
                title="Mapa con la ubicación de RITO Rooftop en Sogamoso"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border-0 grayscale-[0.6] hue-rotate-180 invert-[0.88]"
                src={`https://www.google.com/maps?q=${contact.lat},${contact.lng}&z=17&output=embed`}
              />
            </div>
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2.5 text-eyebrow text-amber uppercase underline decoration-amber/40 underline-offset-[0.6rem] hover:decoration-amber focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
            >
              <Navigation aria-hidden="true" className="size-4" />
              Cómo llegar en Google Maps
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-eyebrow text-amber uppercase">Escríbenos</h2>
            <p className="mt-4 mb-8 max-w-prose text-muted-foreground">
              ¿Un cumpleaños, un evento o una pregunta? Cuéntanos y te respondemos por WhatsApp.
              Para reservar mesa, usa la{' '}
              <Link
                to={siteConfig.reservasHref}
                className="text-amber underline decoration-amber/45 underline-offset-4 hover:decoration-amber"
              >
                página de reservas
              </Link>
              .
            </p>
            <ContactoForm />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
