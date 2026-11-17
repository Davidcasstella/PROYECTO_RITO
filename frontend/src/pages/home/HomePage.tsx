import { siteConfig } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { Agenda } from '@/pages/home/sections/Agenda'
import { Caminos } from '@/pages/home/sections/Caminos'
import { LoQueSeSirve } from '@/pages/home/sections/LoQueSeSirve'
import { Portada } from '@/pages/home/sections/Portada'
import { Ritual } from '@/pages/home/sections/Ritual'
import { Vista } from '@/pages/home/sections/Vista'

/**
 * Inicio: la vista desde la terraza, qué es RITO, lo que se sirve, una pausa con la ciudad,
 * lo próximo en la agenda y los caminos hacia el resto del sitio. La llamada a reservar
 * va en el pie, común a todas las páginas.
 */
export function HomePage() {
  useDocumentMeta({
    title: `${siteConfig.nameUpper} Rooftop · Gastrobar & Terraza en Sogamoso`,
    description: siteConfig.description,
  })

  return (
    <>
      <Portada />
      <Ritual />
      <LoQueSeSirve />
      <Vista />
      <Agenda />
      <Caminos />
    </>
  )
}
