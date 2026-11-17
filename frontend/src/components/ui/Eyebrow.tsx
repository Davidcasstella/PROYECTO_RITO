import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const tonos = {
  /** Sobre fondo marfil. */
  accent: 'text-accent-ink after:bg-accent',
  /** Sobre fotografía o fondo oscuro. */
  light: 'text-foreground after:bg-accent',
  amber: 'text-amber after:bg-amber',
} as const

type EyebrowProps = ComponentProps<'p'> & {
  tono?: keyof typeof tonos
  /** Centrada, con la línea debajo centrada también. */
  centrada?: boolean
}

/**
 * Etiqueta pequeña en versales con una línea corta debajo, como en las maquetas.
 * No es un encabezado: el `<h2>` de la sección va justo después.
 */
export function Eyebrow({ tono = 'accent', centrada, className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-eyebrow uppercase',
        "after:mt-4 after:block after:h-px after:w-11 after:content-['']",
        centrada && 'after:mx-auto',
        tonos[tono],
        className,
      )}
      {...props}
    />
  )
}
