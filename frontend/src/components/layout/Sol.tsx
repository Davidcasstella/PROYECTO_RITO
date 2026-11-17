import { cn } from '@/lib/cn'

type SolProps = {
  className?: string
  /** Gira muy despacio (se detiene con `prefers-reduced-motion`). */
  girando?: boolean
}

/**
 * El sol de latón que corona el logo en el muro de RITO: un disco con un aro de rayos en
 * punta, alternando largos y cortos. Dibujado en SVG para que escale sin perder nitidez
 * y tome el color del texto que lo rodea.
 */
export function Sol({ className, girando }: SolProps) {
  const rayos = Array.from({ length: 24 }, (_, i) => i)
  return (
    <svg
      viewBox="-50 -50 100 100"
      aria-hidden="true"
      className={cn(
        'shrink-0',
        girando && 'animate-[sol-girar_60s_linear_infinite] motion-reduce:animate-none',
        className,
      )}
    >
      <g fill="currentColor">
        {rayos.map((i) => {
          const largo = i % 2 === 0 ? 46 : 34
          return (
            <path
              key={i}
              d={`M -4 -14 L 0 -${largo} L 4 -14 Z`}
              transform={`rotate(${i * 15})`}
              opacity={i % 2 === 0 ? 1 : 0.75}
            />
          )
        })}
        <circle r="13" />
      </g>
      <circle
        r="8.5"
        fill="none"
        stroke="var(--color-background)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    </svg>
  )
}
