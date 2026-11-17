import { m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type LineaProps = {
  children: ReactNode
  /** Retraso en segundos, para encadenar varias líneas de un mismo título. */
  delay?: number
  className?: string
  /** `true` = se anima al montar (portadas); si no, al entrar en pantalla. */
  alMontar?: boolean
  /** Con `alMontar`: espera a que esto sea `true` (p. ej. a que se retire la pantalla de carga). */
  activa?: boolean
}

/**
 * Una línea de un título que sube desde detrás de una máscara, como un telón que se abre.
 * Se usa en títulos cortos: cada línea es un `<Linea>` dentro del `<h1>`/`<h2>`, así el texto
 * sigue siendo un solo encabezado para los lectores de pantalla.
 * Con "reducir movimiento" el texto aparece sin desplazamiento.
 */
export function Linea({ children, delay = 0, className, alMontar, activa = true }: LineaProps) {
  const reducido = useReducedMotion()
  const destino = { y: '0%', opacity: 1 }
  return (
    <span className={cn('block overflow-hidden pb-[0.08em]', className)}>
      <m.span
        className="block will-change-transform"
        initial={reducido ? { opacity: 0 } : { y: '105%', opacity: 1 }}
        {...(alMontar
          ? { animate: activa ? destino : undefined }
          : { whileInView: destino, viewport: { once: true, amount: 0.6 } })}
        transition={{ duration: reducido ? 0.3 : 0.95, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </m.span>
    </span>
  )
}
