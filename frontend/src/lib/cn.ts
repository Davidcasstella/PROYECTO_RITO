import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge no conoce la escala tipográfica propia (`text-eyebrow`, `text-h2`…) y la
 * confundiría con un color: al juntarla con `text-amber` borraría el tamaño. Aquí se le
 * dice que son tamaños de letra.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['eyebrow', 'display', 'h2', 'h3', 'lead', 'body'],
    },
  },
})

/** Une clases de Tailwind resolviendo conflictos: cn('px-2', cond && 'px-4') → 'px-4'. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
