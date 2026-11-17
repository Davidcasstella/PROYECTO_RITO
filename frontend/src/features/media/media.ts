/**
 * Fotos y videos del propio restaurante publicados en su web oficial, ritogastrobar.com
 * (galería consultada el 17 de noviembre de 2026).
 *
 * Por ahora se cargan directamente desde esa web. Para servirlos desde este sitio (más
 * rápido y sin depender de la otra web): descargar los archivos a
 * `frontend/public/rito/gallery/` y `frontend/public/rito/video/` con el mismo nombre y
 * cambiar `ORIGEN` por `'/rito'`. Ver `CONTEXTO.md`.
 */
export const ORIGEN = 'https://ritogastrobar.com'

/** Foto de la galería oficial, en 800 o 1600 px de ancho. */
export function fotoWeb(nombre: string, ancho: 800 | 1600 = 800) {
  return `${ORIGEN}/gallery/${nombre}-${ancho}.webp`
}

export type Video = {
  id: string
  titulo: string
  texto: string
  src: string
  /** Foto local que se ve mientras carga o si el video no está disponible. */
  poster: string
}

export const videos: Video[] = [
  {
    id: 'la-idea-de-rito',
    titulo: 'La idea de RITO',
    texto: 'Un santuario de sabores en la Ciudad del Sol.',
    src: `${ORIGEN}/video/la-idea-de-rito.mp4`,
    poster: '/images/muro-rito-detalle.webp',
  },
  {
    id: 'ambiente-terraza',
    titulo: 'La terraza de noche',
    texto: 'Luces cálidas, cielo abierto y la ciudad a tus pies.',
    src: `${ORIGEN}/video/ambiente-terraza.mp4`,
    poster: '/images/vista-plaza.webp',
  },
  {
    id: 'mesa-para-compartir',
    titulo: 'Para compartir',
    texto: 'Los mejores momentos se sirven en el centro.',
    src: `${ORIGEN}/video/mesa-para-compartir.mp4`,
    poster: '/images/salon-mural.webp',
  },
  {
    id: 'noche-dj',
    titulo: 'Las noches',
    texto: 'Viernes y sábado: DJ y cócteles hasta las 2 a. m.',
    src: `${ORIGEN}/video/noche-dj.mp4`,
    poster: '/images/salon-lamparas.webp',
  },
]

/** Las 10 fotos de platos y barra de la galería oficial. */
export const fotosOficiales = [
  {
    id: 'coctel-autor-gordons',
    alt: 'Cóctel de autor con ginebra, brocheta y romero sobre mármol negro.',
  },
  {
    id: 'cazuela-mariscos-terraza',
    alt: 'Cazuela de mariscos humeante con almejas y calamar.',
  },
  { id: 'hamburguesa-doble-papas', alt: 'Hamburguesa doble con papas rústicas y aros de cebolla.' },
  { id: 'coctel-barra-neon', alt: 'Cóctel de la casa frente a las luces neón de la barra.' },
  {
    id: 'plato-compartir-salsas',
    alt: 'Plato para compartir con guacamole, pico de gallo y salsa de la casa.',
  },
  {
    id: 'hamburguesa-rito-mano',
    alt: 'Hamburguesa de la casa en mano, con las luces de la terraza al fondo.',
  },
  { id: 'coctel-autor-romero', alt: 'Cóctel de autor con romero y guarnición.' },
  {
    id: 'cazuela-mariscos-vino',
    alt: 'Cazuela de mariscos con copa de vino blanco y papa criolla, en la terraza.',
  },
  { id: 'tabla-salsas-terraza', alt: 'Tabla para compartir con tres salsas, en la terraza.' },
  {
    id: 'hamburguesa-doble-aros',
    alt: 'Hamburguesa doble con tocineta y aros de cebolla.',
  },
] as const
