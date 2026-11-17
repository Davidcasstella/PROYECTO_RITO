import { describe, expect, it } from 'vitest'
import { estadoAhora, horaLegible, horasReservables } from '@/shared/horario'
import { mensajeWhatsApp, reservaVacia, validarReserva, type Reserva } from '@/shared/reserva'
import { validarContacto } from '@/shared/contacto'

// 17 de noviembre de 2026 (martes) a las 10:00 a. m. en Sogamoso = 15:00 UTC.
const martesManana = new Date('2026-11-17T15:00:00Z')

const valida: Reserva = {
  ...reservaVacia,
  nombre: 'Ana Pérez',
  celular: '300 123 4567',
  fecha: '2026-11-20',
  hora: '19:30',
  personas: '4',
  zona: 'terraza',
  acepta: true,
}

describe('horario', () => {
  it('escribe la hora como en Colombia', () => {
    expect(horaLegible('12:00')).toBe('12:00 m.')
    expect(horaLegible('20:30')).toBe('8:30 p. m.')
    expect(horaLegible('02:00')).toBe('2:00 a. m.')
  })

  it('antes del mediodía está cerrado y abre a las 12', () => {
    expect(estadoAhora(martesManana)).toEqual({
      abierto: false,
      texto: 'Cerrado · abre hoy a las 12:00 m.',
    })
  })

  it('la madrugada del sábado sigue abierto (el viernes cierra a las 2 a. m.)', () => {
    // Sábado 21 a la 1:00 a. m. en Sogamoso = 06:00 UTC.
    expect(estadoAhora(new Date('2026-11-21T06:00:00Z')).abierto).toBe(true)
  })

  it('las reservas van de 12:00 m. a 8:00 p. m., cada media hora', () => {
    const horas = horasReservables('2026-11-20', martesManana)
    expect(horas[0]).toBe('12:00')
    expect(horas.at(-1)).toBe('20:00')
    expect(horas).toHaveLength(17)
  })

  it('para hoy solo ofrece horas que aún no han pasado', () => {
    // Martes a las 7:00 p. m. en Sogamoso = 00:00 UTC del miércoles.
    const tarde = new Date('2026-11-18T00:00:00Z')
    expect(horasReservables('2026-11-17', tarde)).toEqual(['19:30', '20:00'])
  })
})

describe('validarReserva', () => {
  it('acepta una reserva completa', () => {
    expect(validarReserva(valida, martesManana)).toEqual({})
  })

  it('pide los campos obligatorios', () => {
    expect(Object.keys(validarReserva(reservaVacia, martesManana)).sort()).toEqual([
      'acepta',
      'celular',
      'fecha',
      'nombre',
    ])
  })

  it('no acepta reservas después de las 8:00 p. m.', () => {
    expect(validarReserva({ ...valida, hora: '21:00' }, martesManana).hora).toBeDefined()
  })

  it('rechaza una fecha pasada', () => {
    expect(validarReserva({ ...valida, fecha: '2026-11-16' }, martesManana).fecha).toBeDefined()
  })

  it('rechaza datos con forma equivocada (lo que llegaría al servidor)', () => {
    const rara = { ...valida, zona: 'cocina', acepta: 'si' } as unknown as Reserva
    const errores = validarReserva(rara, martesManana)
    expect(errores.zona).toBeDefined()
    expect(errores.acepta).toBeDefined()
  })

  it('arma el mensaje con la plantilla del restaurante', () => {
    const texto = mensajeWhatsApp(valida)
    expect(texto).toContain('*FECHA:* viernes, 20 de noviembre')
    expect(texto).toContain('*HORA:* 7:30 p. m.')
    expect(texto).toContain('*# PERSONAS:* 4')
    expect(texto).toContain('*ZONA:* Terraza')
  })
})

describe('validarContacto', () => {
  it('pide nombre, celular y un mensaje con contenido', () => {
    const errores = validarContacto({ nombre: '', celular: '12', asunto: 'otro', mensaje: 'hola' })
    expect(Object.keys(errores).sort()).toEqual(['celular', 'mensaje', 'nombre'])
  })
})
