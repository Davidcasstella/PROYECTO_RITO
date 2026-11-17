import { Children, useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A partir de cuántos elementos los puntos se cambian por una barra de avance. */
const MAX_PUNTOS = 8

type DeslizableProps = {
  children: ReactNode
  /** Nombre accesible de la lista ("Platos destacados"). */
  etiqueta: string
  /** Clases de la rejilla a partir de tablet (`sm:grid-cols-2 lg:grid-cols-4`). */
  className?: string
  /** Color de los puntos: sobre fondo claro u oscuro. */
  tono?: 'claro' | 'oscuro'
}

/**
 * Lista que en el celular se desliza a los lados y desde tablet es una rejilla normal.
 *
 * - En pantallas pequeñas cada elemento ocupa ~82 % del ancho: asoma el siguiente, así se
 *   entiende sin explicarlo que hay más. El desplazamiento encaja en cada tarjeta (`snap`).
 * - Debajo, unos puntos y un contador dicen en qué tarjeta se está.
 * - Es scroll nativo del navegador: va fluido con el dedo y no pelea con Lenis, que solo
 *   suaviza la rueda del ratón en vertical.
 */
export function Deslizable({ children, etiqueta, className, tono = 'claro' }: DeslizableProps) {
  const listaRef = useRef<HTMLUListElement>(null)
  const [activo, setActivo] = useState(0)
  const total = Children.count(children)

  useEffect(() => {
    const lista = listaRef.current
    if (!lista) return
    let cuadro = 0
    const alDesplazar = () => {
      cancelAnimationFrame(cuadro)
      cuadro = requestAnimationFrame(() => {
        const primero = lista.firstElementChild as HTMLElement | null
        if (!primero) return
        const paso = primero.offsetWidth + parseFloat(getComputedStyle(lista).columnGap || '0')
        // Al llegar al final, el último cuenta como activo aunque no quepa a la izquierda.
        const alFinal = lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - 4
        setActivo(alFinal ? total - 1 : Math.round(lista.scrollLeft / paso))
      })
    }
    lista.addEventListener('scroll', alDesplazar, { passive: true })
    return () => {
      lista.removeEventListener('scroll', alDesplazar)
      cancelAnimationFrame(cuadro)
    }
  }, [total])

  return (
    <div>
      <ul
        ref={listaRef}
        aria-label={etiqueta}
        className={cn(
          // Celular: fila deslizable que llega hasta el borde de la pantalla.
          '-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          // Desde tablet: rejilla normal.
          'sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0',
          className,
        )}
      >
        {children}
      </ul>

      {total > 1 ? (
        <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-3 sm:hidden">
          {total <= MAX_PUNTOS ? (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500 ease-luxe',
                    i === activo ? 'w-6' : 'w-1.5',
                    tono === 'claro'
                      ? i === activo
                        ? 'bg-accent'
                        : 'bg-ink/20'
                      : i === activo
                        ? 'bg-amber'
                        : 'bg-foreground/25',
                  )}
                />
              ))}
            </div>
          ) : (
            // Con muchas fotos, los puntos no caben: una barra que se llena al avanzar.
            <div
              className={cn(
                'h-0.5 w-32 overflow-hidden rounded-full',
                tono === 'claro' ? 'bg-ink/15' : 'bg-foreground/20',
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-500 ease-luxe',
                  tono === 'claro' ? 'bg-accent' : 'bg-amber',
                )}
                style={{ width: `${((activo + 1) / total) * 100}%` }}
              />
            </div>
          )}
          <span
            className={cn(
              'tabular text-eyebrow',
              tono === 'claro' ? 'text-ink-muted' : 'text-muted-foreground',
            )}
          >
            {activo + 1} / {total}
          </span>
        </div>
      ) : null}
    </div>
  )
}

/** Un elemento del `Deslizable`. */
export function DeslizableItem({ className, ...props }: ComponentProps<'li'>) {
  return <li className={cn('w-[82%] shrink-0 snap-start sm:w-auto', className)} {...props} />
}
