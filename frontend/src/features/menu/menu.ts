/**
 * Carta de RITO. Único sitio donde se tocan categorías, platos, textos y precios.
 *
 * Qué es real y qué está pendiente:
 *  - Las CATEGORÍAS y sus frases salen de lo que el propio restaurante publica en Instagram
 *    (@ritorooftop): cócteles de autor y de temporada, cortes, vino, malteadas especiales y
 *    menú del día al mediodía.
 *  - Los PLATOS todavía no están: el restaurante no ha publicado su carta con nombres y
 *    precios, y aquí no se inventan. Mientras una categoría no tenga platos, la página lo
 *    dice con claridad y ofrece pedir la carta por WhatsApp.
 *
 * Para añadir un plato: copiar el ejemplo comentado dentro de `dishes` y rellenarlo. Si
 * tiene foto, guardarla en `public/images/carta/<id>.webp` y poner `foto: true`.
 */
export type Dish = {
  id: string
  name: string
  /** Descripción corta, la que se ve en la tarjeta. */
  description: string
  /** Precio en pesos colombianos, sin formato. `null` = se muestra "Consultar". */
  price: number | null
  /** `true` si hay foto en `public/images/carta/<id>.webp`. */
  foto?: boolean
  alt?: string
  /** Detalle que se muestra al abrir el plato. */
  detalle?: string
  /** Alérgenos o avisos, si aplican. */
  notas?: string[]
  /** Solo por temporada o edición limitada. */
  temporada?: boolean
}

export type MenuCategory = {
  id: string
  title: string
  /** Frase corta que acompaña a la categoría. */
  intro: string
  /** Texto más largo para la tarjeta de la categoría. */
  texto: string
  /** Foto de ambiente que acompaña a la categoría. */
  imagen: string
  imagenAlt: string
  dishes: Dish[]
}

export const menu: MenuCategory[] = [
  {
    id: 'cocteles',
    title: 'Cócteles',
    intro: 'De autor y de temporada.',
    texto:
      'La barra es el corazón de RITO: cócteles únicos y ediciones limitadas que cambian con cada temporada.',
    imagen: '/images/salon-lamparas.webp',
    imagenAlt: 'La barra de RITO al fondo del salón, con las botellas iluminadas.',
    dishes: [
      // {
      //   id: 'nombre-del-coctel',
      //   name: 'Nombre del cóctel',
      //   description: 'Ingredientes principales.',
      //   price: 0,
      // },
    ],
  },
  {
    id: 'cortes',
    title: 'Cortes',
    intro: 'Jugosos, con sello propio.',
    texto: 'Cortes jugosos para compartir en la mesa, con la ciudad de fondo.',
    imagen: '/images/salon-mural.webp',
    imagenAlt: 'Mesas del salón junto al ventanal, con sofás de cuero y el mural de la montaña.',
    dishes: [],
  },
  {
    id: 'vinos',
    title: 'Vinos',
    intro: 'Descorcha tu favorito.',
    texto: 'Una botella para brindar sin prisa, en el salón o al aire libre.',
    imagen: '/images/salon-luz.webp',
    imagenAlt: 'Mesas del salón bañadas por la luz de la tarde que entra por el ventanal.',
    dishes: [],
  },
  {
    id: 'malteadas',
    title: 'Malteadas y temporada',
    intro: 'Ediciones especiales.',
    texto:
      'Malteadas especiales y bebidas de edición limitada para cada temporada: Halloween, Navidad y lo que venga.',
    imagen: '/images/muro-rito-detalle.webp',
    imagenAlt: 'Las letras doradas de RITO y el sol de latón sobre el muro de listones negros.',
    dishes: [],
  },
  {
    id: 'mediodia',
    title: 'Menú del día',
    intro: 'Al mediodía.',
    texto: 'Abrimos a las 12 m.: el plan del almuerzo también se sube a la terraza.',
    imagen: '/images/salon-ventanal.webp',
    imagenAlt: 'El salón de RITO de día, con el ventanal abierto a la ciudad.',
    dishes: [],
  },
]

/** Ruta de la fotografía de un plato. */
export function fotoDe(plato: Dish) {
  return plato.foto ? `/images/carta/${plato.id}.webp` : null
}

/** `true` si la carta ya tiene al menos un plato cargado. */
export const cartaConPlatos = menu.some((c) => c.dishes.length > 0)

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number | null) {
  return price === null ? 'Consultar' : priceFormatter.format(price)
}
