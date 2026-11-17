import { AtSign, MapPin, MessageCircle } from 'lucide-react'
import { NavLink } from 'react-router'
import { Logo } from '@/components/layout/Logo'
import { Sol } from '@/components/layout/Sol'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { EstadoAhora } from '@/components/ui/EstadoAhora'
import { mapsHref, siteConfig, whatsappHref } from '@/config/site'
import { HORARIO_RESUMIDO } from '@/shared/horario'
import { cn } from '@/lib/cn'

const { contact } = siteConfig

const enlace =
  'inline-flex min-h-11 items-center gap-2.5 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber'

/**
 * Pie de página, igual en todas las rutas: arriba, la vista de la terraza con la llamada a
 * reservar; debajo, marca, navegación, dirección con horario y contacto.
 */
export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-background">
      {/* Llamada a reservar sobre la vista de la plaza */}
      <div className="relative isolate overflow-hidden">
        <picture>
          <source media="(max-width: 700px)" srcSet="/images/vista-plaza-sm.webp" />
          <img
            src="/images/vista-plaza.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-background/80 via-background/70 to-background"
        />

        <Container className="py-20 text-center sm:py-28">
          <Sol className="mx-auto size-10 text-accent" girando />
          <h2 className="mt-7 font-display text-h2 text-foreground">
            El atardecer se ve <em className="texto-laton">mejor desde arriba</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-muted-foreground">
            Reserva hasta las 8:00 p. m. y llega con tiempo: guardamos tu mesa 25 minutos.
          </p>
          <ButtonLink to={siteConfig.reservasHref} size="lg" className="mt-9">
            Reservar mesa
          </ButtonLink>
        </Container>
      </div>

      <Container className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1fr] lg:gap-10 xl:gap-16">
        <div>
          <Logo tamano="md" className="text-foreground" />
          <p className="mt-6 max-w-xs text-sm text-muted-foreground">{siteConfig.lema}</p>
          <EstadoAhora className="mt-6 text-foreground/90" />
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-eyebrow text-amber uppercase">Navegación</h2>
          <ul className="mt-5 flex flex-col">
            {[...siteConfig.nav, { label: 'Reservar mesa', href: siteConfig.reservasHref }].map(
              (item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) => cn(enlace, isActive && 'text-foreground')}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div>
          <h2 className="text-eyebrow text-amber uppercase">Visítanos</h2>
          <a href={mapsHref} target="_blank" rel="noreferrer" className={cn(enlace, 'mt-3')}>
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-accent" />
            <span>
              {contact.address}, {contact.city}
            </span>
          </a>

          <dl className="mt-5 flex flex-col gap-2 text-sm">
            {HORARIO_RESUMIDO.map((h) => (
              <div key={h.dias} className="flex flex-col">
                <dt className="text-muted-foreground">{h.dias}</dt>
                <dd className="tabular text-foreground/90">{h.horas}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-eyebrow text-amber uppercase">Contacto</h2>
          <ul className="mt-3 flex flex-col">
            <li>
              <a href={whatsappHref()} target="_blank" rel="noreferrer" className={enlace}>
                <MessageCircle aria-hidden="true" className="size-4 text-accent" />
                WhatsApp {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.instagram} target="_blank" rel="noreferrer" className={enlace}>
                <AtSign aria-hidden="true" className="size-4 text-accent" />
                {contact.instagramUser}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-6">
        <p className="text-sm text-muted-foreground/80">
          © {siteConfig.year} RITO · Cocina Rooftop · Sogamoso, la Ciudad del Sol
        </p>
        <p className="max-w-md text-xs text-muted-foreground/70">
          El exceso de alcohol es perjudicial para la salud. Prohíbase el expendio de bebidas
          embriagantes a menores de edad.
        </p>
      </Container>
    </footer>
  )
}
