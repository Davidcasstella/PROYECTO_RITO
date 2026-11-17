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

/**
 * Fotos de REFERENCIA de Pexels (licencia Pexels: uso libre, sin atribución obligatoria) para
 * los platos y bebidas que aún no tienen foto propia. Ilustran el tipo de plato; no son los
 * platos de RITO, y la carta lo indica con la etiqueta "Foto de referencia". En cuanto haya
 * fotos reales, se cambia `foto` en `features/menu/menu.ts` y la etiqueta desaparece.
 *
 * Se cargan desde el servidor de imágenes de Pexels, que las entrega en WebP del tamaño pedido.
 */
export function fotoPexels(id: number, ancho = 800) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${ancho}`
}

/** Plato o sección → id de la foto de referencia en Pexels. */
export const referencias: Record<string, number> = {
  'crema-trucha-pollo': 17778861,
  'coctel-camaron': 36613634,
  'papas-bacon': 37121076,
  chinchulines: 37287413,
  'canastas-patacon': 37121088,
  'rib-eye': 37389036,
  'baby-beef': 27643022,
  'filet-mignon': 34433608,
  churrasco: 39836909,
  'new-york-steak': 36734926,
  'punta-anca': 40646202,
  parrillada: 36734922,
  costillas: 34495394,
  'pechuga-parrilla': 37575746,
  'pechuga-napolitana': 29042351,
  'salmon-parrilla': 31890213,
  'salmon-ajillo': 39193006,
  trucha: 11776375,
  'risotto-mariscos': 31779538,
  'pasta-marinera': 32966723,
  'arroz-thai': 37173662,
  'vegano-rito': 19805083,
  'burger-bufala': 28841112,
  'burger-extraqueso': 29250659,
  'burger-sencilla': 28760154,
  'tacos-lengua': 25391589,
  'tacos-birria': 31632714,
  'pasta-minirito': 37118296,
  'baby-burger': 35836913,
  'rito-nuggets': 36863577,
  'mojito-clasico': 33129959,
  mojirito: 30412118,
  'mojito-jager': 27626313,
  'black-rose': 11913648,
  baileys: 4915835,
  'summer-queen': 5649898,
  'tequila-sunrise': 34299757,
  'pina-colada': 28575243,
  margarita: 29463223,
  'margarita-kiwi': 39130910,
  'aperol-spritz': 36631083,
  'copa-sangria': 29799870,
  juramento: 27035499,
  'refajo-italiano': 18274903,
  'copa-vino': 14978299,
  'vino-caliente': 29638947,
  'shot-patron': 34566503,
  'cocaina-rusa': 24030673,
  // Secciones en lista (una foto por sección)
  parfait: 11182249,
  malteadas: 34711204,
  delicias: 33674420,
  helados: 17653878,
  jugos: 8215113,
  limonadas: 33107433,
  calientes: 4913342,
  frias: 39948801,
  vinos: 11736166,
  whisky: 19539063,
  tequila: 32912387,
  vodka: 15161548,
  guaro: 25595772,
}
