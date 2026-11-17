import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from './ErrorBoundary'

let shouldThrow = true
function Faulty() {
  if (shouldThrow) throw new Error('fallo de prueba')
  return <p>Vista recuperada</p>
}

describe('ErrorBoundary', () => {
  it('muestra el aviso en lugar de la pantalla en blanco y permite reintentar', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Faulty />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Algo salió mal')

    shouldThrow = false
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(screen.getByText('Vista recuperada')).toBeInTheDocument()
  })
})
