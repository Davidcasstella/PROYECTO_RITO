import { cn } from '@/lib/cn'

type SolProps = {
  className?: string
  /** Gira muy despacio (se detiene con `prefers-reduced-motion`). */
  girando?: boolean
}

/**
 * El emblema de RITO: el sol de la "Ciudad del Sol" con un ojo en el centro, como en la carta
 * y en el muro del local. Rayos en punta, alternando largos y cortos, y un ojo almendrado
 * calado en el disco. SVG propio: escala sin perder nitidez y toma el color del texto.
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
              d={`M -4.2 -15 L 0 -${largo} L 4.2 -15 Z`}
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
