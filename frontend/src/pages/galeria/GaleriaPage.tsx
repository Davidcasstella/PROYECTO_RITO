import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FotoRevelada } from '@/components/media/FotoRevelada'
import { Container } from '@/components/ui/Container'
import { Deslizable, DeslizableItem } from '@/components/ui/Deslizable'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Modal } from '@/components/ui/Modal'
import { siteConfig } from '@/config/site'
import { categoriasGaleria, galeria } from '@/features/galeria/galeria'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { cn } from '@/lib/cn'

const TODAS = 'todas'
/** Recorrido mínimo del dedo, en píxeles, para pasar de foto en el visor. */
const UMBRAL_DESLIZAR = 50

/** Galería por categorías, con visor ampliado y carga diferida. */
export function GaleriaPage() {
  const [categoria, setCategoria] = useState<string>(TODAS)
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(null)
  /** Hacia dónde se movió la última vez: decide por qué lado entra la foto nueva. */
  const [direccion, setDireccion] = useState<1 | -1>(1)
  const toqueX = useRef<number | null>(null)

  useDocumentMeta({
    title: `Galería · ${siteConfig.nameUpper} Rooftop`,
    description:
      'Fotos de RITO Rooftop en Sogamoso: la terraza sobre la plaza, el salón de cuero y latón y el muro del logo.',
  })

  const fotos = useMemo(
    () => (categoria === TODAS ? galeria : galeria.filter((f) => f.categoria === categoria)),
    [categoria],
  )

  const abierta = indiceAbierto !== null ? (fotos[indiceAbierto] ?? null) : null

  /** Cambiar de categoría cierra el visor: el índice ya no apunta a la misma foto. */
  function cambiarCategoria(id: string) {
    setCategoria(id)
    setIndiceAbierto(null)
  }

  function mover(paso: 1 | -1) {
    setDireccion(paso)
    setIndiceAbierto((actual) => {
      if (actual === null) return actual
      return (actual + paso + fotos.length) % fotos.length
    })
  }

  // Flechas del teclado dentro del visor.
  useEffect(() => {
    if (indiceAbierto === null) return
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setDireccion(1)
        setIndiceAbierto((a) => (a === null ? a : (a + 1) % fotos.length))
      }
      if (e.key === 'ArrowLeft') {
        setDireccion(-1)
        setIndiceAbierto((a) => (a === null ? a : (a - 1 + fotos.length) % fotos.length))
      }
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [indiceAbierto, fotos.length])

  const filtros = [{ id: TODAS, titulo: 'Todas' }, ...categoriasGaleria]

  return (
    <>
      <section className="relative isolate overflow-hidden bg-background pt-36 pb-16 sm:pt-44 sm:pb-20">
        <img
          src="/images/salon-lamparas.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full animate-[acercar_9s_var(--ease-luxe)_both] object-cover opacity-25 motion-reduce:animate-none"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background/60" />
        <Container>
          <Eyebrow tono="amber">Galería</Eyebrow>
          <h1 className="mt-7 max-w-3xl font-display text-display text-foreground">
            RITO, <em className="texto-laton">a la luz del día</em>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            La terraza sobre la plaza, el salón de cuero y latón y los detalles que lo hacen único.
          </p>
        </Container>
      </section>

      <section className="bg-marmol py-16 text-ink sm:py-20">
        <Container>
          <div
            role="group"
            aria-label="Filtrar la galería por categoría"
            className="flex flex-wrap gap-2"
          >
            {filtros.map((filtro) => {
              const activo = filtro.id === categoria
              return (
                <button
                  key={filtro.id}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => cambiarCategoria(filtro.id)}
                  className={cn(
                    'inline-flex min-h-11 cursor-pointer items-center rounded-xs px-5 text-eyebrow uppercase',
                    'transition-colors duration-300 ease-luxe',
                    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
                    activo
                      ? 'bg-accent text-accent-foreground'
                      : 'text-ink-muted ring-1 ring-ink/15 hover:bg-ink/5 hover:text-ink',
                  )}
                >
                  {filtro.titulo}
                </button>
              )
            })}
          </div>

          {/* La clave reinicia el fundido cada vez que se cambia de categoría. */}
          <div key={categoria} className="mt-12 animate-[pagina_280ms_ease-out]">
            <Deslizable
              etiqueta="Fotografías"
              className="grid-flow-row-dense sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
            >
              {fotos.map((foto, indice) => (
                <DeslizableItem key={foto.id} className={cn(foto.ancha && 'sm:col-span-2')}>
                  <button
                    type="button"
                    onClick={() => setIndiceAbierto(indice)}
                    className="group relative block w-full cursor-pointer overflow-hidden rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <FotoRevelada
                      src={foto.src}
                      alt={foto.alt}
                      marcoClassName={cn(
                        'rounded-sm',
                        foto.ancha ? 'h-72 sm:h-72' : 'h-72 sm:h-64',
                      )}
                      className="transition-[scale,filter] duration-700 ease-luxe group-hover:scale-[1.05] group-hover:brightness-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    {/* Velo con la descripción, que sube al pasar el ratón. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/80 to-transparent px-5 pt-12 pb-4 text-left text-sm text-marmol opacity-100 transition-[opacity,translate] duration-500 ease-luxe sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100"
                    >
                      {foto.alt}
                    </span>
                    <span className="sr-only">Ver ampliada: {foto.alt}</span>
                  </button>
                </DeslizableItem>
              ))}
            </Deslizable>
          </div>

          <p className="mt-12 text-sm text-ink-muted">
            {fotos.length} fotografía{fotos.length === 1 ? '' : 's'}
            {categoria === TODAS ? ' en total' : ' en esta categoría'}.
          </p>
        </Container>
      </section>

      <Modal
        abierto={abierta !== null}
        onCerrar={() => setIndiceAbierto(null)}
        titulo={abierta ? `Fotografía ampliada: ${abierta.alt}` : 'Fotografía ampliada'}
        className="w-[min(76rem,calc(100vw-2rem))]"
      >
        {abierta ? (
          <figure className="relative">
            {/*
              En el celular se pasa de foto deslizando el dedo. La foto nueva entra por el lado
              hacia el que se avanza; la clave la vuelve a montar para repetir la entrada.
            */}
            <div
              className="overflow-hidden"
              onTouchStart={(e) => {
                toqueX.current = e.touches[0]?.clientX ?? null
              }}
              onTouchEnd={(e) => {
                const inicio = toqueX.current
                const fin = e.changedTouches[0]?.clientX
                toqueX.current = null
                if (inicio === null || fin === undefined) return
                const recorrido = fin - inicio
                if (Math.abs(recorrido) >= UMBRAL_DESLIZAR) mover(recorrido < 0 ? 1 : -1)
              }}
            >
              <img
                key={abierta.id}
                src={abierta.src}
                alt={abierta.alt}
                className={cn(
                  'max-h-[78svh] w-full object-contain motion-reduce:animate-none',
                  direccion === 1
                    ? 'animate-[foto-desde-derecha_450ms_var(--ease-luxe)]'
                    : 'animate-[foto-desde-izquierda_450ms_var(--ease-luxe)]',
                )}
              />
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <button
                type="button"
                onClick={() => mover(-1)}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors duration-300 hover:bg-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
                <span className="sr-only">Fotografía anterior</span>
              </button>

              <figcaption className="flex-1 text-center text-sm text-muted-foreground">
                {(indiceAbierto ?? 0) + 1} de {fotos.length}
                <span className="mt-1 block text-xs text-muted-foreground/75 sm:hidden">
                  Desliza para ver más
                </span>
              </figcaption>

              <button
                type="button"
                onClick={() => mover(1)}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors duration-300 hover:bg-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
                <span className="sr-only">Fotografía siguiente</span>
              </button>
            </div>
          </figure>
        ) : null}
      </Modal>
    </>
  )
}
