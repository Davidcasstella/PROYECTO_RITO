import { ahoraEnSogamoso } from '@/shared/horario'

/**
 * Agenda de RITO: lo que el restaurante anuncia en Instagram.
 * Cada evento desaparece solo de la web el día siguiente a su fecha.
 * Para añadir uno nuevo basta con copiar un bloque y cambiar los datos.
 */
export type Evento = {
  id: string
  /** `aaaa-mm-dd` */
  fecha: string
  titulo: string
  texto: string
  /** Publicación de origen. */
  fuente: string
}

export const eventos: Evento[] = [
  {
    id: 'alborada-2026',
    fecha: '2026-11-28',
    titulo: 'Alborada: llega la Navidad a RITO',
    texto:
      'La mejor alborada de Sogamoso para empezar la Navidad. Arma tu parche, llega temprano y vívela desde la terraza.',
    fuente: 'https://www.instagram.com/ritorooftop/reel/DfsPDK3R3qv/',
  },
]

/** Eventos de hoy en adelante, del más cercano al más lejano. */
export function proximosEventos(ahora = new Date()) {
  const hoy = ahoraEnSogamoso(ahora).fechaISO
  return eventos.filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha))
}
