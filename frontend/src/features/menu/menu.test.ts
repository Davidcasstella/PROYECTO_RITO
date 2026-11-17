import { describe, expect, it } from 'vitest'
import { formatPrice, menu } from '@/features/menu/menu'

describe('carta', () => {
  it('formatea los precios en pesos sin decimales', () => {
    expect(formatPrice(58000).replace(/\s/g, ' ')).toBe('$ 58.000')
  })

  it('no repite identificadores de categoría', () => {
    const ids = menu.map((category) => category.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('sin datos inventados', () => {
  it('muestra "Consultar" cuando no hay precio', () => {
    expect(formatPrice(null)).toBe('Consultar')
  })

  it('ninguna categoría queda sin foto ni texto', () => {
    for (const categoria of menu) {
      expect(categoria.imagen).toMatch(/^\/images\/.+\.webp$/)
      expect(categoria.texto.length).toBeGreaterThan(20)
    }
  })
})
