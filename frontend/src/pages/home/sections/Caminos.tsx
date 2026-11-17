import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'

const caminos = [
  {
    href: '/nosotros',
    titulo: 'El rooftop',
    texto: 'La escalera, el muro de latón, el salón y la terraza sobre la plaza.',
    imagen: '/images/muro-rito-planta-sm.webp',
    alt: 'El muro de listones negros con las letras doradas de RITO y la escalera al fondo.',
  },
  {
    href: '/galeria',
    titulo: 'Galería',
    texto: 'El lugar, de día y con la ciudad de fondo.',
    imagen: '/images/salon-mural-cerca-sm.webp',
    alt: 'Mesas y sofás de cuero del salón, junto al mural de la montaña.',
  },
  {
    href: '/contacto',
    titulo: 'Cómo llegar',
    texto: 'Dirección, horario y la forma más rápida de escribirnos.',
    imagen: '/images/fachada-edificio-sm.webp',
    alt: 'El edificio donde está RITO, en la Carrera 10 de Sogamoso.',
  },
]

/** Tres caminos para seguir desde la portada hacia el resto del sitio. */
export function Caminos() {
  return (
    <section className="bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow tono="amber">Sigue subiendo</Eyebrow>
          <h2 className="mt-6 font-display text-h2 text-foreground">Todo lo que pasa en RITO</h2>
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {caminos.map((camino, indice) => (
            <li key={camino.href}>
              <Reveal delay={indice * 0.06} className="h-full">
                <Link
                  to={camino.href}
                  className="group relative isolate flex h-[26rem] flex-col justify-end overflow-hidden rounded-sm ring-1 ring-border transition-[box-shadow] duration-500 ease-luxe hover:ring-amber/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <img
                    src={camino.imagen}
                    alt={camino.alt}
                    loading="lazy"
                    className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-1000 ease-luxe group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/60 to-background/5"
                  />
                  <span className="p-7">
                    <span className="block font-display text-h3 text-foreground">
                      {camino.titulo}
                    </span>
                    <span className="mt-2 block text-sm text-muted-foreground">{camino.texto}</span>
                    <span className="mt-6 flex items-center gap-3 text-eyebrow text-amber uppercase">
                      Entrar
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-300 ease-luxe group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      />
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
