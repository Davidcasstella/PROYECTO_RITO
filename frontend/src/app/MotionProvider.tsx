import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Configuración global de Motion.
 * - LazyMotion + `m.*` carga solo las funciones de animación que usamos (paquete más ligero).
 * - reducedMotion="user" respeta a quien tiene activado "reducir movimiento" en su sistema.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
