import { Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { Sol } from '@/components/layout/Sol'
import { cn } from '@/lib/cn'

type CintaProps = {
  palabras: string[]
  className?: string
  /** Segundos que tarda en dar una vuelta completa. */
  duracion?: number
  /** Sentido del desplazamiento. */
  inverso?: boolean
}

/**
 * Cinta de palabras que se desplaza sin fin (nombres de platos, por ejemplo), separadas por
 * el sol de RITO. Es decorativa: el texto real está en la página. Se detiene al pasar el
 * ratón, con su botón de pausa (WCAG 2.2.2) y con "reducir movimiento".
 */
export function Cinta({ palabras, className, duracion = 60, inverso }: CintaProps) {
  const [pausada, setPausada] = useState(false)
  const fila = (oculta: boolean) => (
    <ul aria-hidden={oculta || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {palabras.map((p, i) => (
        <li key={`${p}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
          <span>{p}</span>
          <Sol className="size-[0.6em] text-accent" />
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className={cn(
          'flex w-max animate-[cinta_var(--dur)_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none',
          inverso && '[animation-direction:reverse]',
          pausada && '[animation-play-state:paused]',
        )}
        style={{ '--dur': `${duracion}s` } as React.CSSProperties}
      >
        {fila(false)}
        {fila(true)}
      </div>
      <button
        type="button"
        onClick={() => setPausada((v) => !v)}
        aria-pressed={pausada}
        className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/70 text-foreground opacity-60 ring-1 ring-foreground/15 backdrop-blur transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber motion-reduce:hidden"
      >
        {pausada ? (
          <Play aria-hidden="true" className="size-3.5" />
        ) : (
          <Pause aria-hidden="true" className="size-3.5" />
        )}
        <span className="sr-only">{pausada ? 'Mover la cinta' : 'Detener la cinta'}</span>
      </button>
    </div>
  )
}
