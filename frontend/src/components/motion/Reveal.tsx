import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { transitions } from '@/lib/motion'

const directions = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
} as const

type RevealProps = {
  children: ReactNode
  /** Desde dónde entra. */
  from?: keyof typeof directions
  /** Retraso en segundos, para encadenar varios. */
  delay?: number
  className?: string
}

/** Aparece suavemente cuando entra en pantalla al hacer scroll. */
export function Reveal({ children, from = 'up', delay = 0, className }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, ...directions[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...transitions.smooth, delay }}
    >
      {children}
    </m.div>
  )
}
