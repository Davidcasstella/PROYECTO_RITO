import { useEffect, useState } from 'react'
import { estadoAhora, type EstadoLocal } from '@/shared/horario'
import { cn } from '@/lib/cn'

/**
 * "Abierto · cierra a las 11:00 p. m.", calculado con la hora de Sogamoso aunque el
 * visitante esté en otra zona horaria. Se recalcula cada minuto.
 */
export function EstadoAhora({ className }: { className?: string }) {
  const [estado, setEstado] = useState<EstadoLocal>(() => estadoAhora())

  useEffect(() => {
    const id = window.setInterval(() => setEstado(estadoAhora()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <p className={cn('inline-flex items-center gap-2.5 text-sm', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'size-2 rounded-full',
          estado.abierto
            ? 'bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400/70'
            : 'bg-foreground/40',
        )}
      />
      {estado.texto}
    </p>
  )
}
