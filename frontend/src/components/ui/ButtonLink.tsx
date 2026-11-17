import { Link, type LinkProps } from 'react-router'
import { buttonStyles, type ButtonStyleProps } from '@/components/ui/buttonStyles'
import { cn } from '@/lib/cn'

/** Enlace con aspecto de botón (navega a otra página). */
export function ButtonLink({ variant, size, className, ...props }: LinkProps & ButtonStyleProps) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />
}
