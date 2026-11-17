/**
 * Secuencias cinematográficas: fotogramas sueltos en WebP que se dibujan en un
 * canvas según el scroll (no son videos; el usuario controla el avance y el retroceso).
 *
 * Cada secuencia tiene dos juegos, elegidos según el ancho de pantalla:
 *   lg → 240 fotogramas a 1280 px (escritorio)
 *   sm → 120 fotogramas a 820 px  (móvil: la mitad de pasos y la cuarta parte de peso)
 *
 * Los dos juegos empiezan en el primer fotograma del clip y terminan en el último, así que
 * el recorrido es el mismo aunque cambie el número de pasos. Los archivos van numerados con
 * ceros a la izquierda (`0001.webp`), de modo que el orden natural y el alfabético coinciden.
 */
export type VarianteSecuencia = 'lg' | 'sm'

export type Secuencia = {
  id: string
  /** Número de fotogramas de cada juego. */
  frames: Record<VarianteSecuencia, number>
  /** Imagen de respaldo si el canvas o los fotogramas fallan. */
  poster: string
  alt: string
}

/**
 * Recorrido de entrada de RITO: PENDIENTE. Se activará cuando lleguen los videos del
 * cliente (calle → escaleras con "RITO" grabado → muro del logo → terraza). Hasta entonces
 * la portada usa una fotografía fija (`pages/home/sections/Portada.tsx`). Cómo convertir
 * los videos en fotogramas: ver `CONTEXTO.md`, sección "Videos para el scroll".
 */
export const secuenciaEntrada: Secuencia = {
  id: 'entrada',
  frames: { lg: 240, sm: 120 },
  poster: '/images/vista-sol.webp',
  alt: 'Recorrido desde la calle hasta la terraza de RITO, con la plaza de Sogamoso al fondo.',
}

/** Ruta de un fotograma. `index` empieza en 0. */
export function frameSrc(secuencia: Secuencia, variante: VarianteSecuencia, index: number) {
  return `/frames/${secuencia.id}/${variante}/${String(index + 1).padStart(4, '0')}.webp`
}

/**
 * Qué juego usar. Se decide una sola vez al montar: cambiar de juego a mitad de la
 * secuencia obligaría a descargarlo entero otra vez.
 */
export function elegirVariante(): VarianteSecuencia {
  if (typeof window === 'undefined') return 'sm'
  const anchoCss = window.innerWidth
  // Pantallas pequeñas, y también las medianas con poca memoria, se quedan con el juego ligero.
  const memoria = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (anchoCss < 900) return 'sm'
  if (memoria !== undefined && memoria <= 4) return 'sm'
  return 'lg'
}

/** Carga una imagen y resuelve aunque falle, para que un fallo no bloquee la pantalla de carga. */
export function cargarImagen(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}
