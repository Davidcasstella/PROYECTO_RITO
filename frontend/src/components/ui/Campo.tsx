import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Clases comunes de los campos de formulario, sobre fondo oscuro. */
export const campoBase =
  'w-full rounded-xs border border-border bg-background/70 px-4 text-foreground placeholder:text-muted-foreground/60 transition-colors duration-200 focus:border-amber focus:outline-2 focus:outline-offset-2 focus:outline-amber'

export const campoAlto = 'h-12'

type PropsHijo = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

type CampoProps = {
  id: string
  etiqueta: string
  error?: string
  ayuda?: string
  className?: string
  children: (props: PropsHijo) => ReactNode
}

/**
 * Campo de formulario con la etiqueta siempre visible (nunca solo el marcador de posición),
 * la ayuda opcional y el error justo debajo, no en un resumen al principio.
 */
export function Campo({ id, etiqueta, error, ayuda, className, children }: CampoProps) {
  const errorId = `${id}-error`
  const ayudaId = `${id}-ayuda`
  const describedBy = [ayuda && ayudaId, error && errorId].filter(Boolean).join(' ')

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-eyebrow text-muted-foreground uppercase">
        {etiqueta}
      </label>
      {children({
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {ayuda ? (
        <p id={ayudaId} className="text-sm text-muted-foreground/80">
          {ayuda}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
