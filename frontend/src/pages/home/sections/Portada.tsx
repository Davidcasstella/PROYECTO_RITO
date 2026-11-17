import { ChevronDown } from 'lucide-react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Sol } from '@/components/layout/Sol'
import { VideoFondo } from '@/components/media/VideoFondo'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { EstadoAhora } from '@/components/ui/EstadoAhora'
import { siteConfig } from '@/config/site'
import { videos } from '@/features/media/media'

/**
 * Portada: la vista desde la terraza, a pantalla completa.
 *
 * Una fotografía real del rooftop que se acerca muy despacio y se aleja al bajar
 * (paralaje). En pantallas grandes se le pone encima el video "La terraza de noche" de la
 * web oficial. Cuando estén los fotogramas del recorrido por scroll, este bloque se cambia
 * por `FrameSequence` con `secuenciaEntrada`.
 */
export function Portada() {
  const ref = useRef<HTMLElement>(null)
  const reducido = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yFoto = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacidadTexto = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const yTexto = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={ref} className="relative isolate flex min-h-svh items-end overflow-hidden">
      <m.div className="absolute inset-0 -z-20" style={reducido ? undefined : { y: yFoto }}>
        <picture>
          <source media="(max-width: 700px)" srcSet="/images/vista-sol-sm.webp" />
          <img
            src="/images/vista-sol.webp"
            alt="La plaza de Sogamoso vista desde la terraza de RITO, con palmeras, la ciudad y el sol en lo alto."
            fetchPriority="high"
            className="size-full animate-[acercar_14s_var(--ease-luxe)_both] object-cover motion-reduce:animate-none"
          />
        </picture>
        {/* En pantallas grandes, encima de la foto: la terraza de noche, en video. */}
        <VideoFondo
          src={videos.find((v) => v.id === 'ambiente-terraza')!.src}
          className="absolute inset-0"
        />
      </m.div>

      {/* Velo: oscuro abajo, donde va el texto; el cielo queda limpio. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/70 to-background/35 sm:via-background/55 sm:to-background/10"
      />

      <m.div
        className="w-full"
        style={reducido ? undefined : { opacity: opacidadTexto, y: yTexto }}
      >
        <Container className="pt-40 pb-16 sm:pb-24">
          <p className="flex items-center gap-3 text-eyebrow text-amber uppercase">
            <Sol className="size-5 text-accent" girando />
            Cocina Rooftop · Sogamoso
          </p>

          <h1 className="mt-7 max-w-4xl font-display text-display text-foreground">
            Donde la ciudad
            <br />
            <em className="texto-laton">se ve distinta</em>
          </h1>

          <p className="mt-7 max-w-lg text-lead text-muted-foreground">
            {siteConfig.firma} Cocina de fuego, coctelería de autor y una terraza en el corazón de
            la Ciudad del Sol.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink to={siteConfig.reservasHref} size="lg">
              Reservar mesa
            </ButtonLink>
            <ButtonLink to="/menu" size="lg" variant="outline">
              Ver la carta
            </ButtonLink>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6">
            <EstadoAhora className="text-foreground/90" />
            <a
              href="#ritual"
              className="inline-flex min-h-11 items-center gap-2 text-eyebrow text-foreground/75 uppercase transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
            >
              Descubre el rooftop
              <ChevronDown
                aria-hidden="true"
                className="size-4 animate-bounce motion-reduce:animate-none"
              />
            </a>
          </div>
        </Container>
      </m.div>
    </section>
  )
}
