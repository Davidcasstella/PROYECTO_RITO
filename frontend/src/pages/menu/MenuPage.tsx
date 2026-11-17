import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { FotoRevelada } from '@/components/media/FotoRevelada'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { Deslizable, DeslizableItem } from '@/components/ui/Deslizable'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { siteConfig, whatsappHref } from '@/config/site'
import { menu, type Dish } from '@/features/menu/menu'
import { PlatoModal } from '@/features/menu/PlatoModal'
import { TarjetaPlato } from '@/features/menu/TarjetaPlato'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { cn } from '@/lib/cn'

/**
 * La carta: un índice de categorías fijo arriba y, por cada una, su foto de ambiente, su
 * texto y sus platos. Las categorías sin platos todavía lo dicen y ofrecen pedir la carta
 * por WhatsApp: no se inventan platos ni precios.
 */
export function MenuPage() {
  const [platoAbierto, setPlatoAbierto] = useState<Dish | null>(null)
  const location = useLocation()

  useDocumentMeta({
    title: `Carta · ${siteConfig.nameUpper} Rooftop`,
    description:
      'La carta de RITO Rooftop en Sogamoso: cócteles de autor y de temporada, cortes, vinos, malteadas especiales y menú del día.',
  })

  // Llegar con /menu#cortes lleva a esa categoría, aunque las imágenes aún no hayan cargado.
  useEffect(() => {
    if (!location.hash) return
    const id = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
    }, 350)
    return () => window.clearTimeout(id)
  }, [location.hash])

  return (
    <>
      <section className="listones relative isolate overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
        <Container>
          <Eyebrow tono="amber">La carta</Eyebrow>
          <h1 className="mt-7 max-w-3xl font-display text-display text-foreground">
            Para brindar <em className="texto-laton">en lo alto</em>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            Cócteles únicos, cortes con sello propio, vino para descorchar y ediciones que cambian
            con cada temporada.
          </p>
        </Container>
      </section>

      {/* Índice de categorías: se queda a mano bajo la cabecera al bajar. */}
      <nav
        aria-label="Categorías de la carta"
        className="sticky top-[4.25rem] z-30 border-y border-border bg-background/92 backdrop-blur-md"
      >
        <Container>
          <ul className="-mx-2 flex [scrollbar-width:none] gap-1 overflow-x-auto py-2">
            {menu.map((c) => (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#${c.id}`}
                  className="inline-flex min-h-11 items-center rounded-xs px-4 text-eyebrow whitespace-nowrap text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <div className="bg-marmol text-ink">
        {menu.map((categoria, i) => (
          <section
            key={categoria.id}
            id={categoria.id}
            aria-labelledby={`cat-${categoria.id}`}
            className="scroll-mt-36 border-b border-ink/10 py-16 sm:py-20"
          >
            <Container>
              <div
                className={cn(
                  'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
                  i % 2 === 1 && 'lg:[&>*:first-child]:order-last',
                )}
              >
                <FotoRevelada
                  src={categoria.imagen}
                  alt={categoria.imagenAlt}
                  width={1280}
                  height={720}
                  loading="lazy"
                  marcoClassName="aspect-16/10 rounded-sm"
                  className="size-full object-cover"
                />

                <Reveal>
                  <p className="tabular font-display text-[1.1rem] text-accent-ink">0{i + 1}</p>
                  <h2 id={`cat-${categoria.id}`} className="mt-3 font-display text-h2">
                    {categoria.title}
                  </h2>
                  <p className="mt-2 text-eyebrow text-accent-ink uppercase">{categoria.intro}</p>
                  <p className="mt-6 max-w-md text-lead text-ink-muted">{categoria.texto}</p>

                  {categoria.dishes.length === 0 ? (
                    <div className="mt-8 max-w-md rounded-sm border border-ink/12 bg-marmol-deep/60 p-5">
                      <p className="text-sm text-ink-muted">
                        Estamos subiendo esta parte de la carta. Mientras tanto, pídela por WhatsApp
                        y te la enviamos.
                      </p>
                      <a
                        href={whatsappHref(
                          `Hola RITO, ¿me pueden enviar la carta de ${categoria.title.toLowerCase()}?`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex min-h-11 items-center gap-2.5 text-eyebrow text-accent-ink uppercase underline decoration-accent-ink/40 underline-offset-[0.6rem] hover:decoration-accent-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink"
                      >
                        <MessageCircle aria-hidden="true" className="size-4" />
                        Pedir la carta
                      </a>
                    </div>
                  ) : null}
                </Reveal>
              </div>

              {categoria.dishes.length > 0 ? (
                <div className="mt-12">
                  <Deslizable
                    etiqueta={categoria.title}
                    className="sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
                  >
                    {categoria.dishes.map((plato) => (
                      <DeslizableItem key={plato.id}>
                        <TarjetaPlato plato={plato} onAbrir={setPlatoAbierto} />
                      </DeslizableItem>
                    ))}
                  </Deslizable>
                </div>
              ) : null}
            </Container>
          </section>
        ))}

        <Container className="py-12">
          <p className="text-sm text-ink-muted">
            Precios en pesos colombianos. La propina es voluntaria. Pregunta por las ediciones de
            temporada: cambian cada pocas semanas.
          </p>
        </Container>
      </div>

      <PlatoModal plato={platoAbierto} onCerrar={() => setPlatoAbierto(null)} />
    </>
  )
}
