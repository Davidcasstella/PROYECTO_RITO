import { fotoWeb, fotosOficiales } from '@/features/media/media'

/**
 * Fotografías de la galería, todas del propio restaurante:
 *  - las del local, de la carpeta PROYECTO_RITO del cliente (se dejaron fuera las dos donde
 *    salen personas de frente);
 *  - las de cocina y barra, de la galería de la web oficial ritogastrobar.com.
 */
export type CategoriaGaleria = 'cocina' | 'terraza' | 'salon' | 'detalles' | 'llegada'

export type FotoGaleria = {
  id: string
  src: string
  alt: string
  categoria: CategoriaGaleria
  /** `true` = ocupa el doble de ancho en el mosaico de escritorio. */
  ancha?: boolean
  /** Foto local por si la remota no carga. */
  respaldo?: string
}

export const categoriasGaleria: { id: CategoriaGaleria; titulo: string }[] = [
  { id: 'cocina', titulo: 'Cocina y barra' },
  { id: 'terraza', titulo: 'Terraza y vista' },
  { id: 'salon', titulo: 'Salón' },
  { id: 'detalles', titulo: 'Detalles' },
  { id: 'llegada', titulo: 'Cómo llegar' },
]

const foto = (
  id: string,
  categoria: CategoriaGaleria,
  alt: string,
  ancha?: boolean,
): FotoGaleria => ({ id, src: `/images/${id}.webp`, alt, categoria, ancha })

const oficiales: FotoGaleria[] = fotosOficiales.map((foto, i) => ({
  id: foto.id,
  src: fotoWeb(foto.id),
  alt: foto.alt,
  categoria: 'cocina',
  ancha: i === 1 || i === 7,
  respaldo: '/images/muro-rito-detalle.webp',
}))

export const galeria: FotoGaleria[] = [
  ...oficiales,
  foto(
    'vista-sol',
    'terraza',
    'La plaza de Sogamoso desde la terraza, con el sol en lo alto, palmeras y la ciudad al fondo.',
    true,
  ),
  foto(
    'vista-plaza',
    'terraza',
    'La plaza vista desde la baranda: jardines, palmeras, edificios y montañas en el horizonte.',
  ),
  foto(
    'vista-baranda',
    'terraza',
    'La baranda metálica de la terraza y, abajo, la plaza con sus caminos de ladrillo.',
    true,
  ),
  foto(
    'salon-rito',
    'salon',
    'El salón: sofás de cuero coñac, sillas marfil, lámparas negras y el logo dorado al fondo.',
    true,
  ),
  foto(
    'salon-mural',
    'salon',
    'Mesas junto al ventanal, sofás corridos de cuero y el mural de la montaña iluminado.',
  ),
  foto(
    'salon-lamparas',
    'salon',
    'Vista general del salón con las lámparas colgantes y la barra al fondo.',
  ),
  foto(
    'salon-luz',
    'salon',
    'La luz de la tarde entra por el ventanal y cae sobre las mesas del salón.',
  ),
  foto(
    'salon-ventanal',
    'salon',
    'El salón desde el ventanal, con la ciudad reflejada en el vidrio.',
  ),
  foto(
    'muro-rito',
    'detalles',
    'El muro del logo: listones negros con vetas doradas, el sol de latón y las letras de RITO.',
    true,
  ),
  foto(
    'muro-rito-detalle',
    'detalles',
    'Detalle de las letras doradas de RITO y la palabra "Gastrobar" bajo el sol de latón.',
  ),
  foto(
    'salon-mural-cerca',
    'detalles',
    'El mural de la montaña en blanco y negro con una franja de luz cálida al pie.',
  ),
  foto('fachada-edificio', 'llegada', 'El edificio donde está RITO, en la Carrera 10 de Sogamoso.'),
  foto('fachada-calle', 'llegada', 'La Carrera 10 con el edificio de RITO a la derecha.'),
]
