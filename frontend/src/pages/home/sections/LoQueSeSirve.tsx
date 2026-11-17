import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { carta } from '@/features/menu/menu'

/**
 * Lo que se sirve: las categorías de la carta como un índice elegante sobre el muro de
 * listones. Al pasar por encima de cada una, su foto de ambiente aparece detrás.
 */
export function LoQueSeSirve() {
  return (
    <section className="listones relative py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow tono="amber">La carta</Eyebrow>
            <h2 className="mt-7 font-display text-h2 text-foreground">
              Lo que <em className="texto-laton">se sirve</em> arriba
            </h2>
            <p className="mt-6 max-w-sm text-lead text-muted-foreground">
              Cortes madurados al fuego, burgers, sabores mexicanos, postres y una barra donde cada
              cóctel es un rito.
            </p>
            <ArrowLink to="/menu" tono="amber" className="mt-9">
              Ver la carta
            </ArrowLink>
          </Reveal>

          <ol className="border-t border-border">
            {carta.map((categoria, i) => (
              <li key={categoria.id}>
                <Reveal delay={i * 0.05}>
                  <Link
                    to={`/menu#${categoria.id}`}
                    className="group relative flex items-center gap-6 overflow-hidden border-b border-border py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber sm:gap-10 sm:py-9"
                  >
                    <img
                      src={categoria.imagen
                        .replace('-1600.webp', '-800.webp')
                        .replace(/^\/images\/(.+)\.webp$/, '/images/$1-sm.webp')}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="pointer-events-none absolute inset-0 -z-10 size-full scale-105 object-cover opacity-0 transition-[opacity,scale] duration-700 ease-luxe group-hover:scale-100 group-hover:opacity-25 group-focus-visible:opacity-25 motion-reduce:transition-none"
                    />
                    <span
                      aria-hidden="true"
                      className="tabular w-10 shrink-0 font-display text-[1.1rem] text-amber"
                    >
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-h3 text-foreground transition-transform duration-500 ease-luxe group-hover:translate-x-2 motion-reduce:group-hover:translate-x-0">
                        {categoria.titulo}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {categoria.frase}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-6 shrink-0 text-amber transition-transform duration-500 ease-luxe group-hover:rotate-45 motion-reduce:group-hover:rotate-0"
                    />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
