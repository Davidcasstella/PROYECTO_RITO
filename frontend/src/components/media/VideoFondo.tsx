import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  src: string
  className?: string
  /** Ancho mínimo de pantalla para reproducirlo; en celulares se queda la foto (ahorra datos). */
  desde?: number
}

/**
 * Video de ambiente, mudo y en bucle, encima de una foto fija que hace de respaldo.
 * No se reproduce con "reducir movimiento", en pantallas pequeñas ni si el archivo falla:
 * en esos casos simplemente no aparece y se ve la foto de debajo.
 */
export function VideoFondo({ src, className, desde = 768 }: Props) {
  const reducido = useReducedMotion()
  const [ancho, setAncho] = useState(false)
  const [fallo, setFallo] = useState(false)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${desde}px)`)
    const actualizar = () => setAncho(media.matches)
    actualizar()
    media.addEventListener('change', actualizar)
    return () => media.removeEventListener('change', actualizar)
  }, [desde])

  if (reducido || !ancho || fallo) return null

  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setListo(true)}
      onError={() => setFallo(true)}
      className={cn(
        'pointer-events-none size-full object-cover transition-opacity duration-1000',
        listo ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}
