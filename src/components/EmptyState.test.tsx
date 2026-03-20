import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders default message', () => {
    render(<EmptyState />)
    expect(screen.getByText('Henüz işlem eklemediniz')).toBeInTheDocument()
  })

  it('renders custom message', () => {
    render(<EmptyState message="Özel mesaj" />)
    expect(screen.getByText('Özel mesaj')).toBeInTheDocument()
  })

  it('renders with default wallet icon', () => {
    render(<EmptyState />)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with custom icon', () => {
    render(<EmptyState icon={<span data-testid="custom-icon">X</span>} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
})
