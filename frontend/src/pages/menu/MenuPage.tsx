import { Download, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Sol } from '@/components/layout/Sol'
import { FotoRemota } from '@/components/media/FotoRemota'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { siteConfig, whatsappHref } from '@/config/site'
import { carta, formatPrice, type Seccion } from '@/features/menu/menu'
import { TarjetaPlato } from '@/features/menu/TarjetaPlato'
import { ExperienciaPlatos3D } from '@/features/modelos3d/ExperienciaPlatos3D'
import { modelos3d } from '@/features/modelos3d/modelos'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { cn } from '@/lib/cn'

/**
 * La carta completa de RITO, copiada de la carta impresa: cocina, dulce, bebidas y
 * coctelería. Arriba, los platos en 3D; cada plato con modelo tiene "Ver en 3D", que lo
 * lleva al escenario.
 */
export function MenuPage() {
  const location = useLocation()
  const [plato3d, setPlato3d] = useState(modelos3d[0]!.id)

  useDocumentMeta({
    title: `Carta · ${siteConfig.nameUpper} Cocina Rooftop`,
    description:
      'La carta de RITO en Sogamoso: cortes madurados, cerdo y pollo, pescados, pastas, burgers, mexicano, alitas, postres, bebidas, cócteles y licores, con precios y platos en 3D.',
  })

  // Llegar con /menu#burger lleva a esa sección, aunque las imágenes aún no hayan cargado.
  useEffect(() => {
    if (!location.hash) return
    const id = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
    }, 350)
    return () => window.clearTimeout(id)
  }, [location.hash])

  function verEn3D(id: string) {
    setPlato3d(id)
    document.getElementById('platos-3d')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className="listones relative isolate overflow-hidden pt-36 pb-14 sm:pt-44 sm:pb-16">
        <Container>
          <Eyebrow tono="amber">La carta</Eyebrow>
          <h1 className="mt-7 max-w-3xl font-display text-display text-foreground">
            Ascenso <em className="texto-laton">a los sabores</em>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            Nuestra cocina teje historias con cada plato, mezclando tradición y modernidad en un
            festín para los sentidos.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#platos-3d"
              className="inline-flex h-12 items-center rounded-xs bg-accent px-7 text-[0.72rem] font-semibold tracking-[0.2em] text-accent-foreground uppercase transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
            >
              Ver platos en 3D
            </a>
            <a
              href="/carta-rito.pdf"
              download
              className="inline-flex h-12 items-center gap-2.5 rounded-xs px-6 text-[0.72rem] font-semibold tracking-[0.2em] text-foreground uppercase ring-1 ring-foreground/30 transition-colors hover:ring-amber focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
            >
              <Download aria-hidden="true" className="size-4" />
              Carta en PDF
            </a>
          </div>
        </Container>
      </section>

      {/* Índice: grupos y secciones, siempre a mano bajo la cabecera. */}
      <nav
        aria-label="Secciones de la carta"
        className="sticky top-[4.25rem] z-30 border-y border-border bg-background/92 backdrop-blur-md"
      >
        <Container>
          <ul className="-mx-2 flex [scrollbar-width:none] items-center gap-1 overflow-x-auto py-2">
            <li className="shrink-0">
              <a href="#platos-3d" className={enlaceIndice}>
                En 3D
              </a>
            </li>
            {carta.map((grupo) => (
              <li key={grupo.id} className="flex shrink-0 items-center gap-1">
                <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
                {grupo.secciones.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className={enlaceIndice}>
                    {s.titulo}
                  </a>
                ))}
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <ExperienciaPlatos3D seleccion={plato3d} onSeleccion={setPlato3d} />

      {carta.map((grupo) => (
        <div key={grupo.id} id={grupo.id}>
          {/* Portada del grupo */}
          <header className="relative isolate flex min-h-[48svh] items-end overflow-hidden">
            <FotoRemota
              src={grupo.imagen}
              respaldo="/images/salon-rito.webp"
              alt={grupo.imagenAlt}
              loading="lazy"
              className="absolute inset-0 -z-20 size-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/55 to-background/15"
            />
            <Container className="py-12">
              <Reveal>
                <h2 className="font-display text-h2 text-foreground">{grupo.titulo}</h2>
                <p className="mt-3 max-w-xl text-lead text-foreground/85 italic">{grupo.frase}</p>
              </Reveal>
            </Container>
          </header>

          <div className="bg-marmol-deep text-ink">
            {grupo.secciones.map((seccion) => (
              <SeccionCarta key={seccion.id} seccion={seccion} onVer3D={verEn3D} />
            ))}
          </div>
        </div>
      ))}

      <section className="bg-marmol py-14 text-ink">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-xl text-sm text-ink-muted">
            Precios en pesos colombianos. La propina es voluntaria. El menú del día cambia a diario:
            pregúntalo por WhatsApp. Los platos marcados con{' '}
            <Sol className="inline size-4 align-[-2px] text-accent-ink" /> son recomendados de la
            casa.
          </p>
          <a
            href={whatsappHref('Hola RITO, ¿cuál es el menú del día de hoy?')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2.5 text-eyebrow text-accent-ink uppercase underline decoration-accent-ink/40 underline-offset-[0.6rem] hover:decoration-accent-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Menú del día
          </a>
        </Container>
      </section>
    </>
  )
}

const enlaceIndice =
  'inline-flex min-h-11 items-center rounded-xs px-3 text-[0.68rem] tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber'

function SeccionCarta({ seccion, onVer3D }: { seccion: Seccion; onVer3D: (id: string) => void }) {
  return (
    <section
      id={seccion.id}
      aria-labelledby={`t-${seccion.id}`}
      className="scroll-mt-36 border-b border-ink/10 py-14 sm:py-16"
    >
      <Container>
        <Reveal className="max-w-2xl">
          <h3 id={`t-${seccion.id}`} className="font-display text-[clamp(2rem,1.4rem+2vw,3rem)]">
            {seccion.titulo}
          </h3>
          {seccion.intro ? <p className="mt-2 text-ink-muted italic">{seccion.intro}</p> : null}
        </Reveal>

        {seccion.tipo === 'platos' ? (
          <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {seccion.items.map((plato) => (
              <li key={plato.id}>
                <TarjetaPlato plato={plato} onVer3D={plato.modelo ? onVer3D : undefined} />
              </li>
            ))}
          </ul>
        ) : null}

        {seccion.tipo === 'lista' ? (
          <div className="mt-8 max-w-3xl">
            {seccion.columnas ? (
              <div className="flex justify-end gap-6 pb-2 text-eyebrow text-ink-muted uppercase">
                {seccion.columnas.map((c) => (
                  <span key={c} className="w-20 text-right">
                    {c}
                  </span>
                ))}
              </div>
            ) : null}
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {seccion.items.map((item) => (
                <li key={item.name} className="flex items-baseline gap-4 py-3.5">
                  <div className="flex-1">
                    <p className="text-[1.02rem] text-ink">{item.name}</p>
                    {item.detalle ? (
                      <p className="mt-0.5 text-sm text-ink-muted">{item.detalle}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-6">
                    {item.precios.map((p, i) => (
                      <span
                        key={i}
                        className={cn(
                          'tabular w-20 text-right font-display text-[1.15rem]',
                          p === null ? 'text-ink-muted/50' : 'text-accent-ink',
                        )}
                      >
                        {p === null ? '—' : formatPrice(p)}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {seccion.tipo === 'licores' ? (
          <div className="mt-8 max-w-4xl overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left">
              <caption className="sr-only">Precios de {seccion.titulo}</caption>
              <thead>
                <tr className="text-eyebrow text-ink-muted uppercase">
                  <th scope="col" className="pb-2 font-medium">
                    Referencia
                  </th>
                  {['Shot', 'Media', 'Botella'].map((c) => (
                    <th key={c} scope="col" className="w-28 pb-2 text-right font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 border-y border-ink/10">
                {seccion.items.map((l) => (
                  <tr key={l.name}>
                    <th scope="row" className="py-3 pr-4 text-[1rem] font-normal text-ink">
                      {l.name}
                    </th>
                    {[l.shot, l.media, l.botella].map((p, i) => (
                      <td
                        key={i}
                        className={cn(
                          'tabular py-3 text-right font-display text-[1.1rem]',
                          p ? 'text-accent-ink' : 'text-ink-muted/50',
                        )}
                      >
                        {p ? formatPrice(p) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {seccion.pie?.map((linea) => (
          <p key={linea} className="mt-6 max-w-3xl text-sm text-ink-muted">
            {linea}
          </p>
        ))}
      </Container>
    </section>
  )
}
