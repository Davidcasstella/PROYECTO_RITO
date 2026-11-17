import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/cn'

type FotoParalajeProps = {
  src: string
  srcSm?: string
  alt: string
  className?: string
  /** Cuánto se desplaza la foto respecto a la página, en % de su alto. */
  intensidad?: number
}

/**
 * Fotografía de fondo que se mueve más despacio que la página: da profundidad, como mirar
 * la ciudad desde la baranda. Con "reducir movimiento" se queda quieta.
 */
export function FotoParalaje({ src, srcSm, alt, className, intensidad = 12 }: FotoParalajeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducido = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${intensidad}%`, `${intensidad}%`])

  return (
    <div ref={ref} className={cn('absolute inset-0 -z-20 overflow-hidden', className)}>
      <picture>
        {srcSm ? <source media="(max-width: 700px)" srcSet={srcSm} /> : null}
        <m.img
          src={src}
          alt={alt}
          loading="lazy"
          style={reducido ? undefined : { y, scale: 1 + intensidad / 50 }}
          className="size-full object-cover"
        />
      </picture>
    </div>
  )
}
