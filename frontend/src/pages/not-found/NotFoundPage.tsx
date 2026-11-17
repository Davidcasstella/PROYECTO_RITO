import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { siteConfig } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function NotFoundPage() {
  useDocumentMeta({
    title: `Página no encontrada · ${siteConfig.nameUpper}`,
    description: 'La página que buscas no existe o cambió de dirección.',
  })

  return (
    <section className="flex min-h-[80svh] items-center bg-background pt-32 pb-24">
      <Container className="text-center">
        <Eyebrow tono="amber" centrada>
          Error 404
        </Eyebrow>
        <h1 className="mt-6 font-display text-h2 text-foreground">Esta mesa no existe</h1>
        <p className="mx-auto mt-5 max-w-md text-lead text-muted-foreground">
          La página que buscas no está o cambió de dirección. Te acompañamos de vuelta a la terraza.
        </p>
        <ButtonLink to="/" size="lg" className="mt-10">
          Volver al inicio
        </ButtonLink>
      </Container>
    </section>
  )
}
