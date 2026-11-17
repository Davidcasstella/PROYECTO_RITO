import { Box } from 'lucide-react'
import { Sol } from '@/components/layout/Sol'
import { FotoRemota } from '@/components/media/FotoRemota'
import { precioDe, type Dish } from '@/features/menu/menu'
import { cn } from '@/lib/cn'

type Props = {
  plato: Dish
  /** Abre el plato en la sección 3D. Solo se pasa si el plato tiene modelo. */
  onVer3D?: (id: string) => void
}

/**
 * Un plato de la carta: foto si la hay, nombre, descripción, opciones, notas y precio.
 * Los recomendados de la casa (el sol en la carta impresa) llevan el sol. Si el plato tiene
 * modelo 3D, un botón lo abre en el escenario 3D.
 */
export function TarjetaPlato({ plato, onVer3D }: Props) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-sm bg-marmol ring-1 ring-ink/10',
        'transition-[box-shadow,translate] duration-500 ease-luxe hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 motion-reduce:hover:translate-y-0',
      )}
    >
      {plato.foto ? (
        <FotoRemota
          marco="aspect-4/3 overflow-hidden bg-marmol-deep"
          src={plato.foto}
          alt={plato.alt ?? plato.name}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-display text-[1.55rem] leading-tight text-ink">{plato.name}</h4>
          {plato.destacado ? (
            <span title="Recomendado de la casa" className="mt-1 shrink-0 text-accent-ink">
              <Sol className="size-6" />
              <span className="sr-only">Recomendado de la casa</span>
            </span>
          ) : null}
        </div>

        {plato.description ? (
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{plato.description}</p>
        ) : null}

        {plato.opciones?.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Opciones">
            {plato.opciones.map((o) => (
              <li
                key={o}
                className="rounded-full px-3 py-1 text-[0.8rem] text-ink ring-1 ring-ink/15"
              >
                {o}
              </li>
            ))}
          </ul>
        ) : null}

        {plato.notas?.length ? (
          <ul className="mt-3 space-y-0.5 text-[0.85rem] text-ink-muted">
            {plato.notas.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <p className="tabular font-display text-[1.3rem] text-accent-ink">{precioDe(plato)}</p>
          {onVer3D && plato.modelo ? (
            <button
              type="button"
              onClick={() => onVer3D(plato.modelo!)}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-ink px-4 text-[0.7rem] font-semibold tracking-[0.18em] text-marmol uppercase transition-colors hover:bg-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
            >
              <Box aria-hidden="true" className="size-4" />
              Ver en 3D
              <span className="sr-only">: {plato.name}</span>
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
