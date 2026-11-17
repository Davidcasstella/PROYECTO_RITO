import { ButtonLink } from '@/components/ui/ButtonLink'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Modal } from '@/components/ui/Modal'
import { siteConfig } from '@/config/site'
import { fotoDe, formatPrice, type Dish } from '@/features/menu/menu'
import { cn } from '@/lib/cn'

/** Ficha ampliada de un plato: foto, descripción larga, precio y avisos. */
export function PlatoModal({ plato, onCerrar }: { plato: Dish | null; onCerrar: () => void }) {
  const foto = plato ? fotoDe(plato) : null

  return (
    <Modal
      abierto={plato !== null}
      onCerrar={onCerrar}
      titulo={plato ? plato.name : 'Plato'}
      className={cn(foto ? 'w-[min(50rem,calc(100vw-2rem))]' : 'w-[min(32rem,calc(100vw-2rem))]')}
    >
      {plato ? (
        <div className={cn(foto && 'grid sm:grid-cols-2')}>
          {foto ? (
            <img
              src={foto}
              alt={plato.alt ?? plato.name}
              className="h-56 w-full object-cover sm:h-full"
            />
          ) : null}

          <div className="p-6 sm:p-9">
            <Eyebrow tono="amber">{plato.temporada ? 'Edición limitada' : 'En la carta'}</Eyebrow>
            <p className="mt-5 font-display text-h3 text-foreground">{plato.name}</p>
            <p className="tabular mt-3 font-display text-[1.35rem] text-amber">
              {formatPrice(plato.price)}
            </p>
            <p className="mt-6 text-muted-foreground">{plato.detalle ?? plato.description}</p>

            {plato.notas?.length ? (
              <>
                <h3 className="mt-8 text-eyebrow text-muted-foreground uppercase">Ten en cuenta</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {plato.notas.map((nota) => (
                    <li
                      key={nota}
                      className="rounded-xs bg-foreground/10 px-3 py-1.5 text-sm text-muted-foreground"
                    >
                      {nota}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <ButtonLink to={siteConfig.reservasHref} className="mt-9" onClick={onCerrar}>
              Reservar mesa
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
