import { FotoRevelada } from '@/components/media/FotoRevelada'
import { Reveal } from '@/components/motion/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { Eyebrow } from '@/components/ui/Eyebrow'

const cifras = [
  { valor: '12 m.', texto: 'abrimos todos los días' },
  { valor: '2', texto: 'ambientes: salón y terraza' },
  { valor: '2 a. m.', texto: 'cierre de viernes y sábado' },
]

/**
 * Presentación: qué es RITO, contado con lo que se ve en las fotos del local.
 * Sección clara (mármol) para dar respiro entre la portada y las secciones oscuras.
 */
export function Ritual() {
  return (
    <section id="ritual" className="scroll-mt-20 bg-marmol text-ink">
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative">
          <FotoRevelada
            src="/images/salon-rito.webp"
            alt="El salón de RITO: sofás de cuero coñac, sillas tapizadas en marfil, lámparas negras y el logo dorado al fondo."
            width={1280}
            height={720}
            marcoClassName="h-[52svh] sm:h-[65svh] lg:h-full lg:min-h-[44rem]"
            className="size-full object-cover"
          />
        </div>

        <div className="flex items-center px-5 py-16 sm:px-10 lg:py-24 xl:px-20">
          <Reveal from="up" className="max-w-lg">
            <Eyebrow>Gastrobar &amp; terraza</Eyebrow>

            <h2 className="mt-7 font-display text-h2">
              Un ritual que <em>se sube</em> por las escaleras
            </h2>

            <p className="mt-6 text-lead text-ink-muted">
              Se llega por una escalera con nuestro nombre grabado en cada peldaño. Arriba esperan
              el muro de latón, los sofás de cuero y, al fondo, la terraza abierta a la plaza:
              cócteles, cortes, vino y la ciudad a tus pies.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/15 pt-8">
              {cifras.map((c) => (
                <div key={c.texto}>
                  <dt className="sr-only">{c.texto}</dt>
                  <dd>
                    <span className="block font-display text-[clamp(1.6rem,3vw,2.3rem)] leading-none text-accent-ink">
                      {c.valor}
                    </span>
                    <span className="mt-2 block text-sm text-ink-muted">{c.texto}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <ArrowLink to="/nosotros" className="mt-10">
              Conoce el rooftop
            </ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
