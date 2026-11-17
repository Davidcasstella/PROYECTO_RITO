import { m, useScroll, useSpring } from 'motion/react'

/** Hilo de latón bajo la cabecera que se llena a medida que se baja por la página. */
export function BarraProgreso() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-linear-to-r from-accent via-amber to-accent"
    />
  )
}
