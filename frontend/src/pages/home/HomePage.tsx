import { siteConfig } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { ExperienciaPlatos3D } from '@/features/modelos3d/ExperienciaPlatos3D'
import { Agenda } from '@/pages/home/sections/Agenda'
import { Caminos } from '@/pages/home/sections/Caminos'
import { LoQueSeSirve } from '@/pages/home/sections/LoQueSeSirve'
import { Portada } from '@/pages/home/sections/Portada'
import { Ritual } from '@/pages/home/sections/Ritual'
import { ViveRito } from '@/pages/home/sections/ViveRito'
import { Vista } from '@/pages/home/sections/Vista'

/**
 * Inicio: la vista desde la terraza, qué es RITO, lo que se sirve, los platos en 3D, una
 * pausa con la ciudad, los videos, lo próximo en la agenda y los caminos. La llamada a reservar
 * va en el pie, común a todas las páginas.
 */
export function HomePage() {
  useDocumentMeta({
    title: `${siteConfig.nameUpper} · Cocina Rooftop en Sogamoso`,
    description: siteConfig.description,
  })

  return (
    <>
      <Portada />
      <Ritual />
      <LoQueSeSirve />
      <ExperienciaPlatos3D />
      <Vista />
      <ViveRito />
      <Agenda />
      <Caminos />
    </>
  )
}
