import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/** Ancho máximo y márgenes laterales comunes a todas las secciones. */
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[110rem] px-5 sm:px-8 lg:px-12 2xl:px-22', className)}
      {...props}
    />
  )
}
