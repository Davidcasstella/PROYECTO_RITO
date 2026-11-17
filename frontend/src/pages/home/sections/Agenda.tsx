import { CalendarDays } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { siteConfig } from '@/config/site'
import { proximosEventos } from '@/features/agenda/agenda'
import { fechaLegible } from '@/shared/reserva'

/** Próximos planes en RITO. Si no hay ninguno anunciado, la sección no se muestra. */
export function Agenda() {
  const eventos = proximosEventos()
  if (eventos.length === 0) return null

  return (
    <section className="bg-cuero py-20 sm:py-24">
      <Container>
        <Reveal>
          <Eyebrow tono="amber">Próximamente en RITO</Eyebrow>
        </Reveal>

        <ul className="mt-10 grid gap-6">
          {eventos.map((evento) => {
            const [, mes, dia] = evento.fecha.split('-')
            return (
              <li key={evento.id}>
                <Reveal className="grid items-center gap-8 rounded-sm bg-background/35 p-7 ring-1 ring-amber/25 sm:grid-cols-[auto_1fr_auto] sm:p-10">
                  <div className="flex size-28 flex-col items-center justify-center rounded-full ring-1 ring-amber/50">
                    <span className="font-display text-[2.6rem] leading-none text-amber">
                      {dia}
                    </span>
                    <span className="mt-1 text-eyebrow text-foreground/80 uppercase">
                      {new Intl.DateTimeFormat('es-CO', { month: 'short', timeZone: 'UTC' })
                        .format(new Date(Date.UTC(2026, Number(mes) - 1, 1)))
                        .replace('.', '')}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-h3 text-foreground">{evento.titulo}</h2>
                    <p className="mt-3 max-w-2xl text-muted-foreground">{evento.texto}</p>
                    <p className="mt-4 flex items-center gap-2 text-sm text-foreground/80 first-letter:uppercase">
                      <CalendarDays aria-hidden="true" className="size-4 text-amber" />
                      <span className="first-letter:uppercase">{fechaLegible(evento.fecha)}</span>
                    </p>
                  </div>

                  <ButtonLink to={siteConfig.reservasHref} size="lg">
                    Reservar
                  </ButtonLink>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
