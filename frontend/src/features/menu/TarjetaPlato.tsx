import { ArrowRight } from 'lucide-react'
import { FotoRevelada } from '@/components/media/FotoRevelada'
import { fotoDe, formatPrice, type Dish } from '@/features/menu/menu'
import { cn } from '@/lib/cn'

/** Tarjeta de un plato: foto (si la hay), nombre, descripción, precio y acceso a la ficha. */
export function TarjetaPlato({ plato, onAbrir }: { plato: Dish; onAbrir: (plato: Dish) => void }) {
  const foto = fotoDe(plato)
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm bg-marmol-deep/50 ring-1 ring-ink/10 transition-[box-shadow,translate] duration-500 ease-luxe hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 motion-reduce:hover:translate-y-0">
      {foto ? (
        <FotoRevelada
          src={foto}
          alt={plato.alt ?? plato.name}
          width={1000}
          height={750}
          marcoClassName="aspect-4/3"
          className="transition-[scale] duration-700 ease-luxe group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        {plato.temporada ? (
          <p className="mb-3 text-eyebrow text-accent-ink uppercase">Edición limitada</p>
        ) : null}
        <h3 className="font-display text-h3 text-ink">{plato.name}</h3>
        <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">
          {plato.description}
        </p>
        <p className="tabular mt-5 font-display text-[1.2rem] text-accent-ink">
          {formatPrice(plato.price)}
        </p>

        <button
          type="button"
          onClick={() => onAbrir(plato)}
          className={cn(
            'mt-5 inline-flex min-h-11 cursor-pointer items-center gap-3 self-start border-t border-ink/15 pt-5 text-eyebrow text-ink uppercase',
            'transition-colors duration-300 ease-luxe hover:text-accent-ink',
            'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink',
          )}
        >
          Ver detalle
          <span className="sr-only">: {plato.name}</span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-luxe group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </button>
      </div>
    </article>
  )
}
