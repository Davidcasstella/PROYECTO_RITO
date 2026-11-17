import { describe, expect, it } from 'vitest'
import { carta, formatPrice, platoPorId, platos, precioDe } from '@/features/menu/menu'

describe('carta', () => {
  it('formatea los precios en pesos sin decimales', () => {
    expect(formatPrice(52000)).toMatch(/^\$\s?52\.000$/)
    expect(formatPrice(null)).toBe('Consultar')
  })

  it('tiene los cuatro grupos de la carta impresa', () => {
    expect(carta.map((g) => g.id)).toEqual(['cocina', 'dulce', 'bebidas', 'bar'])
  })

  it('los ids de platos y secciones no se repiten (sirven de ancla en la URL)', () => {
    const idsPlatos = platos.map((p) => p.id)
    expect(new Set(idsPlatos).size).toBe(idsPlatos.length)
    const idsSecciones = carta.flatMap((g) => g.secciones.map((s) => s.id))
    expect(new Set(idsSecciones).size).toBe(idsSecciones.length)
  })

  it('copia bien precios clave de la carta impresa', () => {
    expect(platoPorId('rib-eye')?.price).toBe(52000)
    expect(platoPorId('parrillada')?.price).toBe(54000)
    expect(platoPorId('burger-la-plena')?.price).toBe(31000)
    expect(platoPorId('juramento')?.price).toBe(47000)
  })

  it('usa el texto de precio cuando hay tamaños', () => {
    expect(precioDe(platoPorId('nachos')!)).toBe('Pequeños $23.000 · Grandes $31.500')
  })

  it('ningún plato queda sin precio', () => {
    for (const plato of platos) expect(plato.price, plato.id).toBeGreaterThan(0)
  })
})
