import { ArrowRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/cn'

const tonos = {
  accent: 'text-accent-ink decoration-accent-ink/40 hover:decoration-accent-ink',
  light: 'text-foreground decoration-foreground/40 hover:decoration-foreground',
  amber: 'text-amber decoration-amber/40 hover:decoration-amber',
} as const

type Tono = keyof typeof tonos

function clases(tono: Tono, className?: string) {
  return cn(
    'group inline-flex min-h-11 items-center gap-3 text-eyebrow uppercase',
    'underline underline-offset-[0.7rem] transition-colors duration-300 ease-luxe',
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber',
    tonos[tono],
    className,
  )
}

/** Flecha que avanza un poco al pasar por encima. Decorativa: el texto ya dice a dónde va. */
function Flecha() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="size-4 transition-transform duration-300 ease-luxe group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
    />
  )
}

/** Enlace con flecha hacia otra sección de la misma página (ancla). */
export function ArrowAnchor({
  tono = 'accent',
  className,
  children,
  ...props
}: ComponentProps<'a'> & { tono?: Tono }) {
  return (
    <a className={clases(tono, className)} {...props}>
      {children}
      <Flecha />
    </a>
  )
}

/** Enlace con flecha hacia otra página. */
export function ArrowLink({
  tono = 'accent',
  className,
  children,
  ...props
}: LinkProps & { tono?: Tono }) {
  return (
    <Link className={clases(tono, className)} {...props}>
      {children}
      <Flecha />
    </Link>
  )
}
