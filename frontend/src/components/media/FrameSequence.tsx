import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  cargarImagen,
  elegirVariante,
  frameSrc,
  type Secuencia,
  type VarianteSecuencia,
} from '@/features/secuencias/secuencias'
import { alEstarListaLaEntrada } from '@/lib/entrada'
import { cn } from '@/lib/cn'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

type FrameSequenceProps = {
  secuencia: Secuencia
  /** Alto del bloque que se recorre, en vh. El canvas queda fijo mientras dura. */
  alturaVh?: number
  /** Capa de texto encima del canvas (HTML real, no parte de la imagen). */
  children?: ReactNode
  /** Progreso 0→1 en el que la capa de texto ya se ha desvanecido del todo. */
  desvanecerTextoEn?: number
  /**
   * Avance que se reproduce solo al entrar, sin que haga falta hacer scroll (0 = ninguno).
   * Sirve para que la página no se quede parada en el primer fotograma.
   */
  avanceAutomatico?: number
  /** El texto ya se ve al llegar (para la secuencia que abre la página), no al bajar. */
  textoDesdeElPrincipio?: boolean
  className?: string
  id?: string
}

/** Grupos en los que se descargan los fotogramas después de los primeros. */
const TAMANO_GRUPO = 12
/** Cuántos fotogramas se cargan antes de dar la secuencia por utilizable. */
const PRIMEROS = 8
/** Cuánto se acerca el fotograma mostrado al objetivo en cada cuadro (0→1). */
const SUAVIZADO = 0.14
/** Duración del avance automático de entrada. */
const AVANCE_MS = 1800

/**
 * Secuencia de fotogramas controlada por el scroll.
 *
 * - El bloque mide `alturaVh` y el canvas se queda fijo (sticky) ocupando la pantalla entera.
 * - El progreso vertical elige el fotograma: arriba el primero, abajo el último.
 * - Se puede subir y bajar; al terminar se conserva el último fotograma.
 * - El fotograma mostrado **persigue** al que pide el scroll en vez de saltar a él, así un
 *   golpe de rueda o un gesto brusco no da un tirón.
 * - Al entrar reproduce un avance corto por su cuenta (`avanceAutomatico`), para que no se
 *   quede congelada en la primera imagen; a partir de ahí manda el scroll.
 * - Los fotogramas se descargan por grupos y nunca se dibuja un hueco: si el exacto aún no
 *   está, se mantiene el más cercano ya cargado (así no parpadea).
 * - Con "reducir movimiento" no se recorre nada: se funde del primer fotograma al último.
 */
export function FrameSequence({
  secuencia,
  alturaVh = 400,
  children,
  desvanecerTextoEn = 0.32,
  avanceAutomatico = 0,
  textoDesdeElPrincipio = false,
  className,
  id,
}: FrameSequenceProps) {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textoRef = useRef<HTMLDivElement>(null)

  const [variante] = useState<VarianteSecuencia>(elegirVariante)
  const [reducido] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [falloTotal, setFalloTotal] = useState(false)

  const total = secuencia.frames[variante]

  // Estado mutable del reproductor. En refs: cambia en cada cuadro y no debe re-renderizar.
  const imagenes = useRef<(HTMLImageElement | null)[]>([])
  const progresoScroll = useRef(0)
  const progresoAuto = useRef(0)
  const progresoSuave = useRef(0)
  const dibujado = useRef(-1)

  // ---------------------------------------------------------------- descarga por grupos
  useEffect(() => {
    if (reducido) return
    imagenes.current = new Array(total).fill(null)
    let cancelado = false

    async function cargarRango(desde: number, hasta: number) {
      const pendientes = []
      for (let i = desde; i < hasta && i < total; i += 1) {
        if (imagenes.current[i]) continue
        pendientes.push(
          cargarImagen(frameSrc(secuencia, variante, i)).then((img) => {
            if (!cancelado) imagenes.current[i] = img
          }),
        )
      }
      await Promise.all(pendientes)
    }

    async function descargar() {
      // Primero lo que se ve nada más entrar, para poder dibujar cuanto antes.
      await cargarRango(0, PRIMEROS)
      if (cancelado) return
      if (!imagenes.current[0]) {
        setFalloTotal(true)
        return
      }
      // El resto, por grupos y uno detrás de otro: no se satura la red ni se bloquea la página.
      for (let desde = PRIMEROS; desde < total; desde += TAMANO_GRUPO) {
        if (cancelado) return
        await cargarRango(desde, desde + TAMANO_GRUPO)
      }
    }

    void descargar()

    return () => {
      cancelado = true
      // Soltar las imágenes al desmontar para no retener memoria.
      imagenes.current = []
    }
  }, [secuencia, variante, total, reducido])

  // ---------------------------------------------------------------- dibujo en el canvas
  useGSAP(
    () => {
      if (reducido || falloTotal) return
      const canvas = canvasRef.current
      const contenedor = contenedorRef.current
      if (!canvas || !contenedor) return

      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) {
        setFalloTotal(true)
        return
      }

      /** Fotograma ya cargado más cercano al pedido: evita dibujar huecos. */
      function masCercanoCargado(objetivo: number) {
        const lista = imagenes.current
        if (lista[objetivo]) return objetivo
        for (let d = 1; d < total; d += 1) {
          if (objetivo - d >= 0 && lista[objetivo - d]) return objetivo - d
          if (objetivo + d < total && lista[objetivo + d]) return objetivo + d
        }
        return -1
      }

      /** Dibuja «a lo object-fit: cover»: llena la pantalla sin deformar la imagen. */
      function pintar(indice: number) {
        const img = imagenes.current[indice]
        if (!img || !ctx || !canvas) return
        const { width: cw, height: ch } = canvas
        const escala = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
        const w = img.naturalWidth * escala
        const h = img.naturalHeight * escala
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
        dibujado.current = indice
      }

      function ajustarTamano() {
        if (!canvas) return
        // devicePixelRatio limitado a 2: más allá solo multiplica píxeles sin verse mejor.
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = Math.round(canvas.clientWidth * dpr)
        const h = Math.round(canvas.clientHeight * dpr)
        if (canvas.width === w && canvas.height === h) return
        canvas.width = w
        canvas.height = h
        if (dibujado.current >= 0) pintar(dibujado.current)
      }

      // Un solo bucle de dibujo: se despierta cuando hace falta y se duerme al llegar.
      let rafId = 0
      let corriendo = false

      function paso() {
        const objetivo = Math.max(progresoScroll.current, progresoAuto.current)
        const diferencia = objetivo - progresoSuave.current

        // Persecución suave; si está muy cerca, se encaja y se para el bucle.
        if (Math.abs(diferencia) < 0.0004) {
          progresoSuave.current = objetivo
          corriendo = false
        } else {
          progresoSuave.current += diferencia * SUAVIZADO
        }

        const indice = Math.min(total - 1, Math.round(progresoSuave.current * (total - 1)))
        const disponible = masCercanoCargado(indice)
        if (disponible >= 0 && disponible !== dibujado.current) pintar(disponible)

        if (corriendo) rafId = requestAnimationFrame(paso)
      }

      function despertar() {
        if (corriendo) return
        corriendo = true
        rafId = requestAnimationFrame(paso)
      }

      ajustarTamano()

      const trigger = ScrollTrigger.create({
        trigger: contenedor,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progresoScroll.current = self.progress
          despertar()
        },
        onRefresh: ajustarTamano,
      })

      // Avance de entrada: la secuencia se mueve sola un poco, sin tocar el scroll.
      // Espera a que se retire la pantalla de carga; si no, se reproduciría detrás de ella
      // y al entrar se vería la fachada ya quieta.
      let avance: gsap.core.Tween | undefined
      let cancelarEspera = () => {}
      if (avanceAutomatico > 0) {
        cancelarEspera = alEstarListaLaEntrada(() => {
          const estado = { v: 0 }
          avance = gsap.to(estado, {
            v: avanceAutomatico,
            duration: AVANCE_MS / 1000,
            ease: 'power2.inOut',
            delay: 0.35,
            onUpdate: () => {
              progresoAuto.current = estado.v
              despertar()
            },
          })
        })
      }

      // Mientras llegan los grupos, repintar de vez en cuando para ir afinando la imagen.
      const afinar = window.setInterval(despertar, 350)

      const observador = new ResizeObserver(() => {
        ajustarTamano()
        despertar()
      })
      observador.observe(canvas)

      despertar()

      return () => {
        trigger.kill()
        cancelarEspera()
        avance?.kill()
        observador.disconnect()
        window.clearInterval(afinar)
        cancelAnimationFrame(rafId)
        corriendo = false
      }
    },
    { scope: contenedorRef, dependencies: [reducido, falloTotal, total, avanceAutomatico] },
  )

  // ---------------------------------------------------------------- capa de texto
  useGSAP(
    () => {
      const texto = textoRef.current
      const contenedor = contenedorRef.current
      if (!texto || !contenedor || !children) return

      if (reducido) {
        gsap.set(texto, { autoAlpha: 1 })
        return
      }

      // El texto se va al avanzar, para dejar ver la secuencia. `autoAlpha` además pone
      // visibility:hidden al llegar a 0: una vez desvanecido, deja de recibir clics y
      // desaparece para los lectores de pantalla.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contenedor,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      })

      if (textoDesdeElPrincipio) {
        // Es lo primero de la página: el titular ya está ahí al llegar, no hay que bajar
        // para que aparezca.
        gsap.set(texto, { autoAlpha: 1, y: 0 })
        tl.to(texto, { autoAlpha: 1, duration: desvanecerTextoEn })
      } else {
        tl.fromTo(texto, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1 }).to(texto, {
          autoAlpha: 1,
          duration: Math.max(0.04, desvanecerTextoEn - 0.18),
        })
      }

      tl.to(texto, { autoAlpha: 0, y: -24, duration: 0.12 }).to(
        {},
        { duration: Math.max(0.1, 1 - desvanecerTextoEn - 0.04) },
      )
    },
    { scope: contenedorRef, dependencies: [reducido, desvanecerTextoEn, textoDesdeElPrincipio] },
  )

  // ---------------------------------------------------------------- reducir movimiento
  if (reducido || falloTotal) {
    return (
      <section
        id={id}
        ref={contenedorRef}
        className={cn('relative isolate overflow-hidden bg-background', className)}
      >
        <ReducidoOFallo secuencia={secuencia} variante={variante} falloTotal={falloTotal} />
        {children ? (
          <div ref={textoRef} className="absolute inset-0 flex items-center">
            {children}
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <section
      id={id}
      ref={contenedorRef}
      className={cn('relative bg-background', className)}
      style={{ height: `${alturaVh}vh` }}
      aria-label={secuencia.alt}
    >
      {/* svh en vez de vh: en móvil el alto no da el salto que da la barra del navegador. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          // El canvas es decorativo: el recorrido se describe en el aria-label del bloque.
          role="presentation"
        />
        {children ? (
          <div ref={textoRef} className="absolute inset-0 flex items-center">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/**
 * Versión sin recorrido: con "reducir movimiento" activado se funde del primer fotograma
 * al último en lugar de ejecutar los 240. Si falló la carga, se queda la imagen de respaldo.
 */
function ReducidoOFallo({
  secuencia,
  variante,
  falloTotal,
}: {
  secuencia: Secuencia
  variante: VarianteSecuencia
  falloTotal: boolean
}) {
  const [mostrarFinal, setMostrarFinal] = useState(false)

  useEffect(() => {
    if (falloTotal) return
    const id = window.setTimeout(() => setMostrarFinal(true), 900)
    return () => window.clearTimeout(id)
  }, [falloTotal])

  if (falloTotal) {
    return (
      <img
        src={secuencia.poster}
        alt={secuencia.alt}
        className="h-[80svh] w-full object-cover"
        loading="lazy"
      />
    )
  }

  const total = secuencia.frames[variante]
  return (
    <div className="relative h-[80svh] w-full">
      <img
        src={frameSrc(secuencia, variante, 0)}
        alt={secuencia.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={frameSrc(secuencia, variante, total - 1)}
        alt=""
        aria-hidden="true"
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-luxe',
          mostrarFinal ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}
