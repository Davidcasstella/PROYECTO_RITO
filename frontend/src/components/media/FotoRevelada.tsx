import { m, useReducedMotion } from 'motion/react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { transitions } from '@/lib/motion'

type FotoReveladaProps = Omit<
  ComponentProps<'img'>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'style'
> & {
  /** Clases del marco (tamaño, bordes redondeados…). */
  marcoClassName?: string
  /** Foto local de respaldo si `src` (por ejemplo, una foto de otra web) no carga. */
  respaldo?: string
}

/**
 * Fotografía que se descubre al entrar en pantalla: el marco se abre como una cortina desde
 * el centro mientras la imagen se asienta de un ligero acercamiento a su tamaño.
 *
 * En los carruseles del celular el efecto se dispara al deslizar cada foto hasta la vista.
 * Con "reducir movimiento" solo hay un fundido.
 *
 * El acercamiento al pasar el ratón lo pone quien la usa con `group-hover:scale-*`: la
 * propiedad `scale` de CSS se suma al `transform` de la animación sin pisarlo.
 */
export function FotoRevelada({ marcoClassName, className, respaldo, ...img }: FotoReveladaProps) {
  const reducido = useReducedMotion()
  // Poco umbral: en los carruseles del celular la foto siguiente solo asoma por el borde y
  // tiene que verse ya, no como un hueco vacío.
  const viewport = { once: true, amount: 0.05 } as const

  return (
    <m.div
      className={cn('overflow-hidden', marcoClassName)}
      initial={reducido ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(10% 8% 10% 8%)' }}
      whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={viewport}
      transition={{ ...transitions.smooth, duration: 1.1 }}
    >
      <m.img
        loading="lazy"
        decoding="async"
        {...img}
        onError={(e) => {
          const foto = e.currentTarget
          if (respaldo && !foto.src.endsWith(respaldo)) foto.src = respaldo
        }}
        className={cn('size-full object-cover', className)}
        initial={reducido ? false : { scale: 1.16 }}
        whileInView={{ scale: 1 }}
        viewport={viewport}
        transition={{ ...transitions.smooth, duration: 1.5 }}
      />
    </m.div>
  )
}
