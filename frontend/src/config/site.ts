/**
 * Datos editables del sitio. Cambiar aquí, nunca dentro de los componentes.
 *
 * De dónde sale cada dato (consultado el 17 de noviembre de 2026):
 *  - Nombre, descripción y estilo: perfil de Instagram @ritorooftop.
 *  - WhatsApp y reglas de reserva: el enlace de reservas del perfil (shorturl.at/PdZPi), que
 *    abre WhatsApp con la plantilla del restaurante.
 *  - Dirección y horario: ficha de Google Maps "RITO Rooftop".
 *
 * Lo que sigue entre corchetes no se ha facilitado: se muestra tal cual y la web desactiva
 * sola lo que no se puede hacer sin ese dato.
 */

import { NEGOCIO } from '@/shared/negocio'

/** Marca un dato que aún no es real, para poder detectarlo y avisar. */
export type Pending = `[${string}]`

export const siteConfig = {
  name: 'Rito',
  nameUpper: 'RITO',
  tagline: 'Rooftop · Gastrobar',
  description:
    'RITO Rooftop, gastrobar y terraza en Sogamoso: cócteles de autor, cortes, vinos y atardeceres sobre la plaza. Reserva tu mesa por WhatsApp.',
  /** Frase de marca, la del perfil de Instagram. */
  lema: 'Cócteles únicos, buena vibra y atardeceres mágicos en Sogamoso.',

  /** URL pública, para las etiquetas de compartir. Se cambia al tener dominio propio. */
  url: 'https://proyecto-rito.vercel.app',

  /** Navegación principal. Cada entrada es una página con su propia URL. */
  nav: [
    { label: 'Inicio', href: '/' },
    { label: 'Carta', href: '/menu' },
    { label: 'El rooftop', href: '/nosotros' },
    { label: 'Galería', href: '/galeria' },
    { label: 'Contacto', href: '/contacto' },
  ],

  /** Página de reservas, a la que lleva siempre el botón del encabezado. */
  reservasHref: '/reservas',

  contact: {
    address: 'Cra. 10 #12-14',
    city: 'Sogamoso, Boyacá',
    /** Para buscar en el mapa. */
    direccionCompleta: 'RITO Rooftop, Cra. 10 #12-14, Sogamoso, Boyacá, Colombia',
    /** Coordenadas de la ficha de Google Maps. */
    lat: 5.7151016,
    lng: -72.9269093,
    phone: '320 397 3011',
    /** Solo dígitos, para los enlaces `tel:` y `wa.me`. Colombia es +57. */
    phoneE164: NEGOCIO.whatsapp,
    email: '[Correo del restaurante]' as Pending,
    instagram: 'https://www.instagram.com/ritorooftop/',
    instagramUser: '@ritorooftop',
    facebook: '[Facebook]' as Pending,
  },

  /** Año del aviso de derechos del pie de página. */
  year: 2026,
} as const

/** `true` si el dato sigue siendo un valor provisional entre corchetes. */
export function isPending(value: string): value is Pending {
  return value.startsWith('[') && value.endsWith(']')
}

/** Enlace de WhatsApp con un mensaje ya escrito. */
export function whatsappHref(mensaje = 'Hola, quisiera reservar una mesa en RITO.') {
  return `https://wa.me/${siteConfig.contact.phoneE164}?text=${encodeURIComponent(mensaje)}`
}

/** Enlace a Google Maps con la ficha del lugar. */
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  siteConfig.contact.direccionCompleta,
)}`
