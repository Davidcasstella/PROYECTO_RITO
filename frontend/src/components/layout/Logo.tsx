import { Sol } from '@/components/layout/Sol'
import { cn } from '@/lib/cn'

const tamanos = {
  sm: { sol: 'size-6 sm:size-7', nombre: 'text-[1.35rem] sm:text-[1.5rem]' },
  md: { sol: 'size-7 sm:size-9', nombre: 'text-[1.55rem] sm:text-[1.9rem]' },
  lg: { sol: 'size-14 sm:size-16', nombre: 'text-[2.6rem] sm:text-[3.2rem]' },
} as const

type LogoProps = {
  tamano?: keyof typeof tamanos
  className?: string
}

/**
 * Marca: el sol con el ojo y "RITO" en serif, con "COCINA ROOFTOP" debajo en versales,
 * como en la carta del restaurante. Se compone con texto real: se puede seleccionar,
 * escala con la pantalla y los lectores de pantalla lo leen.
 */
export function Logo({ tamano = 'md', className }: LogoProps) {
  const t = tamanos[tamano]
  return (
    <span className={cn('inline-flex items-center gap-2.5 leading-none', className)}>
      <Sol className={cn('text-accent', t.sol)} />
      <span className="inline-flex flex-col items-center">
        <span className={cn('font-display font-semibold tracking-[0.16em]', t.nombre)}>RITO</span>
        <span
          aria-hidden="true"
          className="mt-1 text-[0.48rem] tracking-[0.3em] whitespace-nowrap text-accent uppercase sm:text-[0.52rem]"
        >
          Cocina rooftop
        </span>
      </span>
      <span className="sr-only">Cocina rooftop</span>
    </span>
  )
}
