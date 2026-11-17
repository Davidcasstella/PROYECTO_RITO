import type { Transition, Variants } from 'motion/react'

/** Tiempos y curvas compartidos para que todas las animaciones se sientan iguales. */
export const transitions = {
  spring: { type: 'spring', stiffness: 260, damping: 30 },
  smooth: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const satisfies Record<string, Transition>

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
}

export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
