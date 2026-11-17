import { ReactLenis, useLenis, type LenisRef } from 'lenis/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Avisa a ScrollTrigger en cada scroll de Lenis (debe estar dentro de ReactLenis). */
function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update)
  return null
}

/**
 * Scroll suave con Lenis, sincronizado con GSAP ScrollTrigger:
 * el reloj de GSAP mueve Lenis y cada scroll de Lenis actualiza ScrollTrigger.
 * Si el usuario pidió "reducir movimiento", se deja el scroll normal del navegador.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const [enabled] = useState(() => !prefersReducedMotion())

  useEffect(() => {
    if (!enabled) return
    // Leer la instancia en cada tick: Lenis se crea después del primer render.
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [enabled])

  if (!enabled) return children

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
