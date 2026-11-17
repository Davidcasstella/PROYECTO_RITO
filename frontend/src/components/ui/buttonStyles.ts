import { cn } from '@/lib/cn'

// Variantes explícitas en vez de props booleanas (isPrimary, isGhost…).
const variants = {
  /** Acción principal: borgoña con marfil encima (7,2:1). */
  primary: 'bg-accent text-accent-foreground hover:bg-accent-hover',
  /** Sobre fotografía o fondo oscuro. */
  outline: 'ring-1 ring-foreground/70 text-foreground hover:bg-foreground hover:text-ink',
  /** Sobre fondo marfil. */
  outlineInk: 'ring-1 ring-ink/30 text-ink hover:bg-ink hover:text-marmol',
  /** Sobre el panel verde oliva. */
  outlineBurgundy:
    'ring-1 ring-accent-ink text-accent-ink hover:bg-accent hover:text-accent-foreground',
  ghost: 'text-foreground hover:bg-foreground/10',
} as const

const sizes = {
  md: 'h-11 px-6 text-[0.7rem] tracking-[0.2em]',
  lg: 'h-13 px-7 text-[0.72rem] tracking-[0.2em] sm:h-14 sm:px-9 sm:text-[0.78rem]',
} as const

export type ButtonStyleProps = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

/** Clases de botón reutilizables también en enlaces (ver ButtonLink y AnchorButton). */
export function buttonStyles({ variant = 'primary', size = 'md' }: ButtonStyleProps = {}) {
  return cn(
    // min-h-11 asegura el área táctil mínima de 44 px aunque cambie el tamaño de fuente.
    'inline-flex min-h-11 cursor-pointer items-center justify-center gap-3 rounded-xs',
    'font-sans font-semibold whitespace-nowrap uppercase',
    'transition-colors duration-300 ease-luxe',
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
  )
}
