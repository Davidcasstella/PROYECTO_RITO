import { describe, expect, it } from 'vitest'
import { platoPorId, platos } from '@/features/menu/menu'
import { modelos3d } from '@/features/modelos3d/modelos'

describe('platos en 3D', () => {
  it('cada modelo corresponde a un plato real de la carta, con precio', () => {
    for (const modelo of modelos3d) {
      const plato = platoPorId(modelo.id)
      expect(plato, modelo.id).toBeDefined()
      expect(plato?.price).toBeGreaterThan(0)
      expect(plato?.modelo).toBe(modelo.id)
    }
  })

  it('los platos que dicen tener modelo lo tienen', () => {
    const ids = new Set(modelos3d.map((m) => m.id))
    for (const plato of platos.filter((p) => p.modelo)) expect(ids.has(plato.modelo!)).toBe(true)
  })

  it('los archivos existen', () => {
    const archivos = new Set(
      Object.keys(import.meta.glob('/public/{models,images/modelos}/*', { query: '?url' })).map(
        (ruta) => ruta.replace('/public', ''),
      ),
    )
    for (const modelo of modelos3d) {
      expect(archivos.has(modelo.glb), modelo.glb).toBe(true)
      if (modelo.usdz) expect(archivos.has(modelo.usdz), modelo.usdz).toBe(true)
      expect(archivos.has(`/images/modelos/${modelo.id}.webp`)).toBe(true)
    }
  })
})
