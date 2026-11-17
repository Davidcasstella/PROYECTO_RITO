import { describe, expect, it } from 'vitest'
import { frameSrc, secuenciaEntrada } from '@/features/secuencias/secuencias'

describe('secuencias', () => {
  it('numera los fotogramas con cuatro cifras, de 0001 en adelante', () => {
    expect(frameSrc(secuenciaEntrada, 'lg', 0)).toBe('/frames/entrada/lg/0001.webp')
    expect(frameSrc(secuenciaEntrada, 'sm', 119)).toBe('/frames/entrada/sm/0120.webp')
  })

  it('ordena igual por nombre que por número (ceros a la izquierda)', () => {
    const rutas = [0, 8, 9, 99, 100, 239].map((i) => frameSrc(secuenciaEntrada, 'lg', i))
    expect([...rutas].sort()).toEqual(rutas)
  })

  it('el juego móvil tiene la mitad de pasos que el de escritorio', () => {
    expect(secuenciaEntrada.frames.sm * 2).toBe(secuenciaEntrada.frames.lg)
  })
})
