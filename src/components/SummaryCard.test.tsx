import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryCard } from '../components/SummaryCard'

describe('SummaryCard', () => {
  it('renders all three summary cards', () => {
    render(
      <SummaryCard totalIncome={1000} totalExpense={500} balance={500} />
    )

    expect(screen.getByText('Toplam Gelir')).toBeInTheDocument()
    expect(screen.getByText('Toplam Gider')).toBeInTheDocument()
    expect(screen.getByText('Bakiye')).toBeInTheDocument()
  })

  it('displays formatted currency values', () => {
    render(
      <SummaryCard totalIncome={1000} totalExpense={600} balance={400} />
    )

    // Check for Turkish Lira formatting - use unique values to avoid duplicates
    expect(screen.getByText('₺1.000,00')).toBeInTheDocument()
    expect(screen.getByText('₺600,00')).toBeInTheDocument()
    expect(screen.getByText('₺400,00')).toBeInTheDocument()
  })

  it('shows positive balance in primary color', () => {
    render(
      <SummaryCard totalIncome={1200} totalExpense={500} balance={700} />
    )

    const balanceElement = screen.getByText('₺700,00')
    expect(balanceElement).toHaveClass('text-primary')
  })

  it('shows negative balance in expense color', () => {
    render(
      <SummaryCard totalIncome={500} totalExpense={1000} balance={-500} />
    )

    const balanceElement = screen.getByText('-₺500,00')
    expect(balanceElement).toHaveClass('text-expense')
  })

  it('uses Turkish labels', () => {
    render(
      <SummaryCard totalIncome={1000} totalExpense={500} balance={500} />
    )

    expect(screen.getByText('Aylık gelir')).toBeInTheDocument()
    expect(screen.getByText('Aylık gider')).toBeInTheDocument()
    expect(screen.getByText('Pozitif bakiye')).toBeInTheDocument()
  })
})
