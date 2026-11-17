import type { ComponentProps } from 'react'
import { buttonStyles, type ButtonStyleProps } from '@/components/ui/buttonStyles'
import { cn } from '@/lib/cn'

export type ButtonProps = ComponentProps<'button'> & ButtonStyleProps

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button type="button" className={cn(buttonStyles({ variant, size }), className)} {...props} />
  )
}
