import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('muestra el texto y responde al clic', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Contactar</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'Contactar' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('no responde si está deshabilitado', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Enviar
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('cn', () => {
  it('no confunde el tamaño propio con un color', async () => {
    const { cn } = await import('@/lib/cn')
    expect(cn('text-eyebrow uppercase', 'text-amber')).toBe('text-eyebrow uppercase text-amber')
  })
})
