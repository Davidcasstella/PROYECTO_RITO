import { useEffect, useRef, useState } from 'react'
import { Sol } from '@/components/layout/Sol'
import { cargarImagen } from '@/features/secuencias/secuencias'
import { cn } from '@/lib/cn'

/** Lo que se ve nada más entrar: la vista de la portada y su versión para celular. */
const RECURSOS = ['/images/vista-sol.webp', '/images/vista-sol-sm.webp', '/images/salon-rito.webp']

/** La entrada nunca dura menos de esto, para que la barra no pegue un salto. */
const MIN_MS = 1400
/** Ni más de esto: si la red va lenta, se entra igual y lo que falte se carga por detrás. */
const MAX_MS = 3500
/** Duración del fundido de salida. */
const SALIDA_MS = 650

/**
 * Pantalla de carga.
 *
 * La barra mide carga real: cuenta las imágenes de la portada que ya terminaron de
 * descargarse, no un porcentaje inventado. El valor que
 * se ve persigue al real con suavidad, así que avanza sin saltos aunque lleguen de golpe.
 *
 * Si todo está listo antes, completa la barra y entra (mínimo 1,4 s). Si la red va lenta,
 * entra igualmente a los 3,5 s y el resto sigue descargándose por detrás.
 */
export function Loader({ onTerminar }: { onTerminar: () => void }) {
  const [progreso, setProgreso] = useState(0)
  const [saliendo, setSaliendo] = useState(false)
  const barraRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const inicio = performance.now()
    const recursos = RECURSOS
    let listos = 0
    let real = 0
    let visible = 0
    let vivo = true
    let rafId = 0
    let salidaId = 0

    for (const src of recursos) {
      void cargarImagen(src).then(() => {
        listos += 1
        real = listos / recursos.length
      })
    }

    function terminar() {
      if (!vivo) return
      vivo = false
      setProgreso(1)
      setSaliendo(true)
      salidaId = window.setTimeout(onTerminar, SALIDA_MS)
    }

    function tick() {
      if (!vivo) return
      const transcurrido = performance.now() - inicio

      // Techo por tiempo: aunque todo esté cargado, la barra tarda un mínimo en llenarse.
      const techo = Math.min(1, transcurrido / MIN_MS)
      const objetivo = Math.min(real, techo)

      // Persecución suave: se acerca un 12 % de lo que falta en cada cuadro.
      visible += (objetivo - visible) * 0.12
      setProgreso(visible)

      if ((real >= 1 && visible >= 0.995 && transcurrido >= MIN_MS) || transcurrido >= MAX_MS) {
        terminar()
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      vivo = false
      cancelAnimationFrame(rafId)
      window.clearTimeout(salidaId)
    }
  }, [onTerminar])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-background px-6',
        'transition-opacity ease-luxe',
        saliendo ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
      style={{ transitionDuration: `${SALIDA_MS}ms` }}
    >
      {/* El muro del logo, muy desenfocado, para que no distraiga. */}
      <img
        src="/images/carga-fondo.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full scale-110 object-cover opacity-45"
      />
      <div aria-hidden="true" className="listones absolute inset-0 opacity-70" />

      <div
        className={cn(
          'relative flex flex-col items-center text-center transition-all ease-luxe',
          saliendo ? 'translate-y-[-0.75rem] opacity-0' : 'opacity-100',
        )}
        style={{ transitionDuration: `${SALIDA_MS - 200}ms` }}
      >
        <Sol className="size-16 text-accent sm:size-20" girando />

        <h1 className="mt-6 font-display text-[clamp(3rem,12vw,5.5rem)] leading-none font-semibold tracking-[0.18em] text-foreground">
          <span className="texto-laton">RITO</span>
        </h1>

        <p className="mt-3 text-eyebrow tracking-[0.5em] text-amber uppercase">Cocina Rooftop</p>

        <div
          ref={barraRef}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progreso * 100)}
          aria-label="Cargando RITO"
          className="mt-10 h-px w-[min(22rem,70vw)] overflow-hidden bg-foreground/25"
        >
          <div
            className="h-full origin-left bg-accent"
            style={{ transform: `scaleX(${progreso})` }}
          />
        </div>

        <span className="sr-only">{Math.round(progreso * 100)} %</span>
      </div>
    </div>
  )
}
