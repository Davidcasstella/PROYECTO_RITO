import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { videos, type Video } from '@/features/media/media'
import { cn } from '@/lib/cn'

/**
 * "Vive el rito": los cuatro videos cortos de la web oficial. Ninguno arranca solo:
 * se reproducen (mudos) al pasar el ratón o al pulsar, y se detienen al salir o pulsar de
 * nuevo. Mientras tanto se ve una foto del local.
 */
export function ViveRito() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow tono="amber">Vive el rito</Eyebrow>
            <h2 className="mt-6 max-w-2xl font-display text-h2 text-foreground">
              Del primer bocado <em className="texto-laton">a la última canción</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Pasa el cursor o toca un video para verlo.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, i) => (
            <li key={video.id}>
              <Reveal delay={i * 0.06}>
                <TarjetaVideo video={video} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function TarjetaVideo({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [fallo, setFallo] = useState(false)

  function reproducir() {
    const v = ref.current
    if (!v || fallo) return
    void v.play().then(
      () => setReproduciendo(true),
      () => setReproduciendo(false),
    )
  }
  function pausar() {
    ref.current?.pause()
    setReproduciendo(false)
  }

  return (
    <div
      className="group relative isolate aspect-[9/14] overflow-hidden rounded-sm bg-surface ring-1 ring-border"
      onMouseEnter={reproducir}
      onMouseLeave={pausar}
    >
      <img
        src={video.poster}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      {!fallo ? (
        <video
          ref={ref}
          src={video.src}
          muted
          loop
          playsInline
          preload="none"
          poster={video.poster}
          onError={() => setFallo(true)}
          onPause={() => setReproduciendo(false)}
          aria-label={video.titulo}
          className={cn(
            'absolute inset-0 -z-10 size-full object-cover transition-opacity duration-500',
            reproduciendo ? 'opacity-100' : 'opacity-0',
          )}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[5] bg-linear-to-t from-background/95 via-background/20 to-transparent"
      />

      <div className="flex h-full flex-col justify-end p-5">
        <p className="font-display text-[1.6rem] leading-tight text-foreground">{video.titulo}</p>
        <p className="mt-1.5 text-sm text-muted-foreground">{video.texto}</p>
        {!fallo ? (
          <button
            type="button"
            onClick={() => (reproduciendo ? pausar() : reproducir())}
            aria-pressed={reproduciendo}
            className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 self-start text-eyebrow text-amber uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            {reproduciendo ? (
              <Pause aria-hidden="true" className="size-4" />
            ) : (
              <Play aria-hidden="true" className="size-4" />
            )}
            {reproduciendo ? 'Pausar' : 'Ver video'}
            <span className="sr-only">: {video.titulo}</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
