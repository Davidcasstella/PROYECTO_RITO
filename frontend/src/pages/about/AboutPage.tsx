import { Reveal } from '@/components/motion/Reveal'
import { FotoParalaje } from '@/components/media/FotoParalaje'
import { FotoRevelada } from '@/components/media/FotoRevelada'
import { Sol } from '@/components/layout/Sol'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { siteConfig } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { cn } from '@/lib/cn'

/** El recorrido de quien llega, contado con las fotos del propio local. */
const recorrido = [
  {
    titulo: 'La escalera',
    texto:
      'El ritual empieza subiendo: cada peldaño lleva grabado el nombre de la casa y una luz cálida guía el camino.',
    imagen: '/images/escalera.webp',
    alt: 'La escalera de RITO, con el nombre grabado en los peldaños iluminados, entre plantas y lámparas.',
  },
  {
    titulo: 'El muro de latón',
    texto:
      'Arriba recibe el sol dorado sobre listones negros con vetas de oro: la firma de RITO y la foto obligada de la noche.',
    imagen: '/images/muro-rito-detalle.webp',
    alt: 'Las letras doradas de RITO y el sol de latón sobre el muro de listones negros con vetas doradas.',
  },
  {
    titulo: 'El salón',
    texto:
      'Sofás corridos de cuero coñac, sillas tapizadas, lámparas negras y un gran mural de montaña en blanco y negro.',
    imagen: '/images/salon-mural-cerca.webp',
    alt: 'El salón de RITO con sofás de cuero coñac, mesas y el mural de la montaña iluminado.',
  },
  {
    titulo: 'La terraza',
    texto:
      'Y al final, el cielo abierto: la plaza, las palmeras y las montañas de Sogamoso, perfectas para el atardecer.',
    imagen: '/images/vista-ciudad.webp',
    alt: 'Vista desde la terraza: la plaza con palmeras, la ciudad y las montañas bajo un cielo con nubes.',
  },
]

const planes = [
  {
    titulo: 'El almuerzo',
    texto: 'Desde las 12 m., con la luz del día entrando por los ventanales.',
  },
  {
    titulo: 'El atardecer',
    texto: 'Cócteles en la terraza mientras cae la tarde sobre la ciudad.',
  },
  { titulo: 'La noche larga', texto: 'Viernes y sábado, hasta las 2 a. m.' },
  {
    titulo: 'La celebración',
    texto: 'Cumpleaños, aniversarios y temporadas especiales con edición limitada.',
  },
]

/**
 * El rooftop: el lugar contado como un recorrido, de la escalera a la terraza.
 * Todo lo que se describe se ve en las fotos del local o sale de su Instagram; no hay
 * fechas de fundación, nombres ni premios, porque no se han facilitado.
 */
export function AboutPage() {
  useDocumentMeta({
    title: `El rooftop · ${siteConfig.nameUpper}`,
    description:
      'Así es RITO Rooftop en Sogamoso: la escalera con nuestro nombre, el muro de latón, el salón de cuero y la terraza sobre la plaza.',
  })

  return (
    <>
      <section className="relative isolate flex min-h-[85svh] items-end overflow-hidden">
        <FotoParalaje
          src="/images/muro-rito.webp"
          srcSm="/images/muro-rito-sm.webp"
          alt="El muro de RITO: listones negros con vetas doradas, el sol de latón y las letras doradas del nombre."
          intensidad={8}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/55 to-background/20"
        />
        <Container className="pt-40 pb-16 sm:pb-24">
          <Eyebrow tono="amber">El rooftop</Eyebrow>
          <h1 className="mt-7 max-w-4xl font-display text-display text-foreground">
            Subir es parte <em className="texto-laton">del ritual</em>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            Gastrobar y terraza frente a la plaza, en Sogamoso. Un lugar para brindar, comer bien y
            mirar la ciudad desde otro ángulo.
          </p>
        </Container>
      </section>

      {/* El recorrido */}
      <section className="bg-marmol py-20 text-ink sm:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>El recorrido</Eyebrow>
            <h2 className="mt-7 font-display text-h2">De la calle al cielo, en cuatro pasos</h2>
          </Reveal>

          <ol className="mt-16 space-y-20 sm:space-y-28">
            {recorrido.map((paso, i) => (
              <li
                key={paso.titulo}
                className={cn(
                  'grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16',
                  i % 2 === 1 && 'lg:grid-cols-[0.8fr_1.2fr] lg:[&>*:first-child]:order-last',
                )}
              >
                <FotoRevelada
                  src={paso.imagen}
                  alt={paso.alt}
                  width={1280}
                  height={720}
                  loading="lazy"
                  marcoClassName="aspect-16/10 rounded-sm"
                  className="size-full object-cover"
                />
                <Reveal>
                  <span
                    aria-hidden="true"
                    className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-none text-accent-ink/30"
                  >
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 font-display text-h2">{paso.titulo}</h3>
                  <p className="mt-5 max-w-md text-lead text-ink-muted">{paso.texto}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Para cada plan */}
      <section className="listones py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <Sol className="mx-auto size-10 text-accent" girando />
            <h2 className="mt-7 font-display text-h2 text-foreground">
              Un lugar, <em className="texto-laton">muchos planes</em>
            </h2>
          </Reveal>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-sm bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
            {planes.map((plan, i) => (
              <li key={plan.titulo} className="bg-background/85 p-8">
                <Reveal delay={i * 0.06}>
                  <h3 className="font-display text-h3 text-foreground">{plan.titulo}</h3>
                  <p className="mt-3 text-muted-foreground">{plan.texto}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <ButtonLink to={siteConfig.reservasHref} size="lg">
              Reservar mesa
            </ButtonLink>
            <ButtonLink to="/galeria" size="lg" variant="outline">
              Ver la galería
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
