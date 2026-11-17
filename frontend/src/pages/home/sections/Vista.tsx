import { FotoParalaje } from '@/components/media/FotoParalaje'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/ui/Container'

/**
 * Pausa a pantalla completa con la vista de la plaza: la foto se mueve más despacio que la
 * página. La frase es del propio restaurante (publicación del 13 de octubre de 2026).
 */
export function Vista() {
  return (
    <section className="relative isolate flex min-h-[90svh] items-center overflow-hidden">
      <FotoParalaje
        src="/images/vista-baranda.webp"
        srcSm="/images/vista-baranda-sm.webp"
        alt="La plaza de Sogamoso desde la baranda de la terraza: palmeras, calles y montañas al fondo."
        intensidad={14}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background/55" />

      <Container className="py-24 text-center">
        <Reveal className="mx-auto max-w-4xl">
          <p className="font-display text-[clamp(2.2rem,1.2rem+4vw,4.8rem)] leading-[1.05] text-foreground italic">
            “Hay planes que se disfrutan el doble con la compañía correcta.”
          </p>
          <p className="mt-8 text-eyebrow text-amber uppercase">— RITO, en Instagram</p>
        </Reveal>
      </Container>
    </section>
  )
}
