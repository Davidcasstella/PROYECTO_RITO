import { useLenis } from 'lenis/react'
import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ModalProps = {
  abierto: boolean
  onCerrar: () => void
  /** Título accesible. Si `tituloVisible` es false solo lo leen los lectores de pantalla. */
  titulo: string
  tituloVisible?: boolean
  children: ReactNode
  className?: string
}

/**
 * Ventana modal accesible.
 *
 * Usa el `<dialog>` del navegador, que ya resuelve lo difícil: cerrar con Escape, mantener
 * el foco dentro, dejar inerte el resto de la página y devolver el foco al cerrar. Encima
 * se añade el bloqueo del scroll suave (Lenis) y el cierre al pulsar fuera.
 */
export function Modal({
  abierto,
  onCerrar,
  titulo,
  tituloVisible = false,
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const tituloId = useId()
  const lenis = useLenis()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (abierto && !dialog.open) {
      dialog.showModal()
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else if (!abierto && dialog.open) {
      dialog.close()
    }
  }, [abierto, lenis])

  // Siempre que el diálogo se cierre (botón, Escape o clic fuera) se devuelve el scroll.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const alCerrar = () => {
      lenis?.start()
      document.body.style.overflow = ''
      onCerrar()
    }
    dialog.addEventListener('close', alCerrar)
    return () => {
      dialog.removeEventListener('close', alCerrar)
      // Si el componente desaparece con el modal abierto, no dejar la página bloqueada.
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [lenis, onCerrar])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={tituloId}
      // Clic en el fondo (fuera del contenido) = cerrar.
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
      className={cn(
        'm-auto w-[min(62rem,calc(100vw-2rem))] max-w-none bg-transparent p-0 text-foreground',
        'backdrop:bg-background/85 backdrop:backdrop-blur-sm',
        'open:animate-[modal-in_240ms_cubic-bezier(0.22,1,0.36,1)]',
        className,
      )}
    >
      <div className="relative max-h-[85svh] overflow-y-auto overscroll-contain rounded-sm bg-surface shadow-2xl shadow-black/50">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute top-3 right-3 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-background/70 text-foreground transition-colors duration-300 hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
        >
          <X aria-hidden="true" className="size-5" />
          <span className="sr-only">Cerrar</span>
        </button>

        <h2 id={tituloId} className={cn(!tituloVisible && 'sr-only')}>
          {titulo}
        </h2>

        {children}
      </div>
    </dialog>
  )
}
