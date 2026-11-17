import {
  Box,
  ChevronLeft,
  ChevronRight,
  Hand,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Ruler,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Sol } from '@/components/layout/Sol'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { siteConfig, whatsappHref } from '@/config/site'
import { platoPorId, precioDe } from '@/features/menu/menu'
import { modelos3d } from '@/features/modelos3d/modelos'
import { cn } from '@/lib/cn'

/** Lo que usamos del elemento `<model-viewer>`; la biblioteca no trae tipos para JSX. */
type ModelViewerElement = HTMLElement & {
  cameraOrbit: string
  getCameraOrbit: () => { theta: number; phi: number; radius: number }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
        Record<string, unknown>
    }
  }
}

type Estado = 'cargando' | 'listo' | 'error'

const ORBITA_INICIAL = '25deg 68deg 92%'
const ZOOM_MIN = 45
const ZOOM_MAX = 160

const herramienta =
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-background/55 text-foreground ring-1 ring-foreground/15 backdrop-blur-md transition-colors duration-300 hover:bg-background/85 hover:ring-amber/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber disabled:cursor-not-allowed disabled:opacity-40'

type Props = {
  /** Id del plato seleccionado, si lo controla la página (la carta lo usa). */
  seleccion?: string
  onSeleccion?: (id: string) => void
  /** Encabezado de la sección: h2 en la portada, h2 también en la carta. */
  titulo?: React.ReactNode
  className?: string
}

/**
 * "La carta en 3D": un escenario a pantalla completa donde el plato flota sobre el sol de
 * RITO y se puede girar, acercar, ver a pantalla completa y, en el celular, poner sobre la
 * mesa con la cámara (realidad aumentada, a tamaño real).
 *
 * - Cada plato muestra su nombre, descripción, opciones y precio REALES de la carta; los
 *   modelos son de muestra y así se dice.
 * - Se cambia de plato con la tira inferior, con las flechas o con las teclas ← →.
 * - `@google/model-viewer` (~290 KB) se descarga solo cuando la sección se acerca a la
 *   pantalla. La cámara solo se pide al pulsar "Ver en mi mesa".
 * - Con "reducir movimiento" no gira solo ni hay transiciones.
 */
export function ExperienciaPlatos3D({ seleccion, onSeleccion, titulo, className }: Props) {
  const seccionRef = useRef<HTMLElement>(null)
  const escenarioRef = useRef<HTMLDivElement>(null)
  const visorRef = useRef<ModelViewerElement>(null)
  const tiraRef = useRef<HTMLDivElement>(null)
  const reducido = useReducedMotion()

  const [interno, setInterno] = useState(modelos3d[0]!.id)
  const actualId = seleccion ?? interno
  const indice = Math.max(
    0,
    modelos3d.findIndex((modelo) => modelo.id === actualId),
  )
  const modelo = modelos3d[indice]!
  const plato = platoPorId(modelo.id)

  const [visible, setVisible] = useState(false)
  const [libreria, setLibreria] = useState<'no' | 'si' | 'error'>('no')
  const [estado, setEstado] = useState<Estado>('cargando')
  const [girando, setGirando] = useState(true)
  const [tocado, setTocado] = useState(false)
  const [pantallaCompleta, setPantallaCompleta] = useState(false)
  /** Distancia de la cámara, en % de la ideal. */
  const [acercamiento, setAcercamiento] = useState(92)

  // La biblioteca solo se pide cuando la sección se acerca a la pantalla.
  useEffect(() => {
    const nodo = seccionRef.current
    if (!nodo) return
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisible(true)
          observador.disconnect()
        }
      },
      { rootMargin: '600px' },
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || libreria !== 'no') return
    let vivo = true
    import('@google/model-viewer')
      .then(() => vivo && setLibreria('si'))
      .catch(() => vivo && setLibreria('error'))
    return () => {
      vivo = false
    }
  }, [visible, libreria])

  useEffect(() => {
    const visor = visorRef.current
    if (!visor || libreria !== 'si') return
    const alCargar = () => setEstado('listo')
    const alFallar = () => setEstado('error')
    // Si la persona arrastra el plato, deja de girar solo: manda ella.
    const alTocar = (e: Event) => {
      if ((e as CustomEvent<{ source?: string }>).detail?.source === 'user-interaction') {
        setGirando(false)
        setTocado(true)
      }
    }
    visor.addEventListener('load', alCargar)
    visor.addEventListener('error', alFallar)
    visor.addEventListener('camera-change', alTocar)
    return () => {
      visor.removeEventListener('load', alCargar)
      visor.removeEventListener('error', alFallar)
      visor.removeEventListener('camera-change', alTocar)
    }
  }, [libreria, modelo.id])

  useEffect(() => {
    const alCambiar = () => setPantallaCompleta(document.fullscreenElement === escenarioRef.current)
    document.addEventListener('fullscreenchange', alCambiar)
    return () => document.removeEventListener('fullscreenchange', alCambiar)
  }, [])

  function elegir(nuevoIndice: number, enfocar = false) {
    const total = modelos3d.length
    const siguiente = modelos3d[(nuevoIndice + total) % total]!
    if (siguiente.id === modelo.id) return
    setEstado('cargando')
    setGirando(true)
    setAcercamiento(92)
    if (seleccion === undefined) setInterno(siguiente.id)
    onSeleccion?.(siguiente.id)

    const boton = tiraRef.current?.querySelector<HTMLButtonElement>(
      `[data-modelo="${siguiente.id}"]`,
    )
    boton?.scrollIntoView({
      behavior: reducido ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
    if (enfocar) boton?.focus({ preventScroll: true })
  }

  function teclas(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      elegir(indice + 1, true)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      elegir(indice - 1, true)
    }
  }

  function zoom(paso: number) {
    const visor = visorRef.current
    if (!visor) return
    const orbita = visor.getCameraOrbit()
    const nuevo = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, acercamiento + paso))
    setAcercamiento(nuevo)
    visor.cameraOrbit = `${orbita.theta}rad ${orbita.phi}rad ${nuevo}%`
  }

  async function alternarPantallaCompleta() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await escenarioRef.current?.requestFullscreen()
    } catch {
      // Algunos navegadores (iPhone) no la permiten sobre un elemento: no pasa nada.
    }
  }

  const listo = libreria === 'si' && estado === 'listo'

  return (
    <section
      ref={seccionRef}
      id="platos-3d"
      aria-labelledby="platos-3d-titulo"
      className={cn('relative isolate scroll-mt-16 overflow-hidden bg-background', className)}
    >
      {/* Ambiente: la foto del plato, enorme y desenfocada, tiñe el escenario de su color. */}
      <AnimatePresence initial={false}>
        <m.img
          key={modelo.id}
          src={`/images/modelos/${modelo.id}.webp`}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.32 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducido ? 0 : 1.1 }}
          className="pointer-events-none absolute inset-0 -z-20 size-full scale-125 object-cover blur-3xl saturate-150"
        />
      </AnimatePresence>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_62%_46%,transparent_0%,var(--color-background)_70%)]"
      />

      <div className="mx-auto grid min-h-svh max-w-[92rem] grid-rows-[auto_1fr_auto] gap-4 px-5 pt-20 pb-6 sm:px-8 lg:px-12 lg:pt-24">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow tono="amber">La carta en 3D</Eyebrow>
            <h2
              id="platos-3d-titulo"
              className="mt-4 max-w-3xl font-display text-[clamp(2.1rem,1.3rem+2.6vw,3.6rem)] leading-[1.04] text-foreground"
            >
              {titulo ?? (
                <>
                  Mira tu plato <em className="texto-laton">antes de pedirlo</em>
                </>
              )}
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Gíralo, acércalo y, desde el celular, ponlo sobre tu mesa con la cámara.
          </p>
        </header>

        <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-4">
          {/* Ficha del plato, con los datos reales de la carta */}
          <div aria-live="polite" className="order-2 lg:order-1">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={modelo.id}
                initial={reducido ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducido ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="tabular font-display text-[1.15rem] text-amber">
                  {String(indice + 1).padStart(2, '0')}
                  <span className="text-muted-foreground">
                    {' '}
                    / {String(modelos3d.length).padStart(2, '0')}
                  </span>
                </p>
                <h3 className="mt-2 font-display text-[clamp(2.2rem,1.4rem+2.8vw,3.8rem)] leading-[1.02] text-foreground">
                  {plato?.name}
                </h3>
                {plato?.description ? (
                  <p className="mt-4 max-w-md text-lead text-muted-foreground">
                    {plato.description}
                  </p>
                ) : null}
                {plato?.opciones?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Opciones">
                    {plato.opciones.map((opcion) => (
                      <li
                        key={opcion}
                        className="rounded-full px-3.5 py-1.5 text-sm text-foreground/90 ring-1 ring-amber/35"
                      >
                        {opcion}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="tabular mt-5 font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.4rem)] text-amber">
                  {plato ? precioDe(plato) : null}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink to={siteConfig.reservasHref}>Reservar mesa</ButtonLink>
                  <a
                    href={whatsappHref(
                      `Hola RITO, vi el plato "${plato?.name ?? ''}" en 3D en la web y quiero pedirlo.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 min-h-11 items-center justify-center rounded-xs px-6 text-[0.72rem] font-semibold tracking-[0.2em] text-foreground uppercase ring-1 ring-foreground/30 transition-colors duration-300 hover:ring-amber focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                  >
                    Pedir por WhatsApp
                  </a>
                </div>

                <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground/80">
                  <Ruler aria-hidden="true" className="size-4 text-amber" />
                  {modelo.tamanoReal} · vista de muestra: la presentación real puede variar.
                </p>
              </m.div>
            </AnimatePresence>
          </div>

          {/* Escenario: el plato flota sobre el sol de RITO */}
          <div
            ref={escenarioRef}
            className={cn(
              'relative order-1 aspect-square w-full lg:order-2 lg:aspect-auto lg:h-[min(58svh,40rem)]',
              pantallaCompleta && 'bg-background',
            )}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <Sol className="size-[88%] max-h-full text-accent/15" girando={!reducido} />
              <div className="absolute bottom-[14%] h-[10%] w-[60%] rounded-[50%] bg-accent/25 blur-2xl" />
            </div>

            {libreria === 'si' ? (
              <model-viewer
                key={modelo.id}
                ref={visorRef}
                src={modelo.glb}
                ios-src={modelo.usdz}
                alt={modelo.alt}
                scale={`${modelo.escala} ${modelo.escala} ${modelo.escala}`}
                // `ar` debe ser un booleano real desde el principio (React 19 lo asigna como
                // propiedad); la cámara no se abre hasta pulsar el botón.
                ar={true}
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="fixed"
                ar-placement="floor"
                camera-controls="true"
                touch-action="pan-y"
                auto-rotate={girando && !reducido ? '' : undefined}
                auto-rotate-delay="400"
                rotation-per-second="18deg"
                interaction-prompt="none"
                environment-image="neutral"
                exposure="1.2"
                shadow-intensity="1.2"
                shadow-softness="0.85"
                camera-orbit={ORBITA_INICIAL}
                min-camera-orbit={`auto 20deg ${ZOOM_MIN}%`}
                max-camera-orbit={`auto 88deg ${ZOOM_MAX}%`}
                interpolation-decay={reducido ? '0' : '80'}
                loading="eager"
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
              >
                <button
                  type="button"
                  slot="ar-button"
                  className="absolute bottom-4 left-1/2 z-10 inline-flex h-12 -translate-x-1/2 cursor-pointer items-center gap-2.5 rounded-full bg-accent px-6 text-[0.72rem] font-semibold tracking-[0.2em] whitespace-nowrap text-accent-foreground uppercase shadow-xl shadow-accent/25 transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <Box aria-hidden="true" className="size-4" />
                  Ver en mi mesa
                </button>
              </model-viewer>
            ) : null}

            {!listo ? (
              <div
                className="absolute inset-0 flex items-center justify-center px-6 text-center"
                role={estado === 'error' || libreria === 'error' ? 'alert' : 'status'}
              >
                {estado === 'error' || libreria === 'error' ? (
                  <p className="max-w-xs text-sm text-muted-foreground">
                    No se pudo cargar el plato en 3D. {modelo.alt}
                  </p>
                ) : (
                  <p className="flex flex-col items-center gap-4 text-eyebrow text-muted-foreground uppercase">
                    <img
                      src={`/images/modelos/${modelo.id}.webp`}
                      alt=""
                      className="size-40 animate-pulse rounded-full object-cover opacity-60 motion-reduce:animate-none"
                    />
                    Sirviendo el plato…
                  </p>
                )}
              </div>
            ) : null}

            {listo && !tocado ? (
              <p className="pointer-events-none absolute inset-x-0 top-2 flex items-center justify-center gap-2 text-eyebrow text-foreground/80 uppercase">
                <Hand
                  aria-hidden="true"
                  className="size-4 animate-pulse motion-reduce:animate-none"
                />
                Arrastra para girar
              </p>
            ) : null}

            {/* Herramientas */}
            <div
              role="toolbar"
              aria-label="Controles del plato en 3D"
              className="absolute top-1/2 right-0 flex -translate-y-1/2 flex-col gap-2.5 sm:right-2"
            >
              <button
                type="button"
                className={herramienta}
                disabled={!listo || !!reducido}
                aria-pressed={girando}
                onClick={() => setGirando((v) => !v)}
              >
                {girando ? (
                  <Pause aria-hidden="true" className="size-4" />
                ) : (
                  <Play aria-hidden="true" className="size-4" />
                )}
                <span className="sr-only">{girando ? 'Detener el giro' : 'Girar 360°'}</span>
              </button>
              <button
                type="button"
                className={herramienta}
                disabled={!listo}
                onClick={() => zoom(-18)}
              >
                <ZoomIn aria-hidden="true" className="size-4" />
                <span className="sr-only">Acercar</span>
              </button>
              <button
                type="button"
                className={herramienta}
                disabled={!listo}
                onClick={() => zoom(18)}
              >
                <ZoomOut aria-hidden="true" className="size-4" />
                <span className="sr-only">Alejar</span>
              </button>
              <button
                type="button"
                className={herramienta}
                aria-pressed={pantallaCompleta}
                onClick={() => void alternarPantallaCompleta()}
              >
                {pantallaCompleta ? (
                  <Minimize2 aria-hidden="true" className="size-4" />
                ) : (
                  <Maximize2 aria-hidden="true" className="size-4" />
                )}
                <span className="sr-only">
                  {pantallaCompleta ? 'Salir de pantalla completa' : 'Pantalla completa'}
                </span>
              </button>
            </div>

            {/* Flechas */}
            <button
              type="button"
              onClick={() => elegir(indice - 1)}
              className={cn(herramienta, 'absolute top-1/2 left-0 -translate-y-1/2 sm:left-2')}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">Plato anterior</span>
            </button>
            <button
              type="button"
              onClick={() => elegir(indice + 1)}
              className={cn(herramienta, 'absolute top-[calc(50%+7.5rem)] right-0 sm:right-2')}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
              <span className="sr-only">Plato siguiente</span>
            </button>
          </div>
        </div>

        {/* Tira de platos */}
        <div
          ref={tiraRef}
          role="group"
          aria-label="Elegir plato"
          onKeyDown={teclas}
          className="-mx-5 flex snap-x [scrollbar-width:none] gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-8 lg:overflow-visible lg:px-0"
        >
          {modelos3d.map((item, i) => {
            const p = platoPorId(item.id)
            const activo = item.id === modelo.id
            return (
              <button
                key={item.id}
                type="button"
                data-modelo={item.id}
                aria-pressed={activo}
                onClick={() => elegir(i)}
                className={cn(
                  'group flex w-36 shrink-0 cursor-pointer snap-center flex-col items-center gap-2 rounded-sm p-2.5 text-center transition-[background-color,box-shadow] duration-300 lg:w-auto',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber',
                  activo
                    ? 'bg-foreground/8 ring-1 ring-amber/60'
                    : 'ring-1 ring-transparent hover:bg-foreground/5',
                )}
              >
                <img
                  src={`/images/modelos/${item.id}.webp`}
                  alt=""
                  width={480}
                  height={480}
                  loading="lazy"
                  className={cn(
                    'size-16 rounded-full object-cover transition-transform duration-500 ease-luxe sm:size-[4.5rem]',
                    activo
                      ? 'scale-110'
                      : 'opacity-75 group-hover:scale-105 group-hover:opacity-100',
                    'motion-reduce:transition-none',
                  )}
                />
                <span className="line-clamp-2 text-[0.8rem] leading-tight text-foreground">
                  {p?.name}
                </span>
                <span className="tabular text-[0.75rem] text-amber">{p ? precioDe(p) : null}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
