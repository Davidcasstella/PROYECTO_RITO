import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { Sol } from '@/components/layout/Sol'

/**
 * Transición entre páginas: al cambiar de ruta, un telón negro con el sol de RITO cubre la
 * pantalla un instante y se levanta descubriendo la página nueva (sube = "ascenso").
 * No bloquea nada: la página ya está cargada debajo y el telón no recibe clics.
 * No sale en la primera carga (ahí está la pantalla de bienvenida) ni con "reducir movimiento".
 */
export function TelonRuta() {
  const { pathname } = useLocation()
  const reducido = useReducedMotion()
  const primera = useRef(true)
  const [clave, setClave] = useState(0)

  useEffect(() => {
    if (primera.current) {
      primera.current = false
      return
    }
    setClave((c) => c + 1)
  }, [pathname])

  if (clave === 0 || reducido) return null

  return (
    <div
      key={clave}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] flex animate-[telon_900ms_cubic-bezier(0.76,0,0.24,1)_forwards] items-center justify-center bg-background"
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent to-transparent" />
      <Sol className="size-14 animate-[telon-sol_900ms_ease-out_forwards] text-accent" />
    </div>
  )
}
