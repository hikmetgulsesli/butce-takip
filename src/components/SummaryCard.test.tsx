import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryCard } from './SummaryCard'

describe('SummaryCard', () => {
  it('renders all three cards with correct labels', () => {
    render(<SummaryCard totalIncome={5000} totalExpense={3000} />)

    expect(screen.getByText('Toplam Gelir')).toBeInTheDocument()
    expect(screen.getByText('Toplam Gider')).toBeInTheDocument()
    expect(screen.getByText('Bakiye')).toBeInTheDocument()
  })

  it('displays Toplam Gelir with sum of all income', () => {
    render(<SummaryCard totalIncome={15000} totalExpense={5000} />)

    const incomeValue = screen.getByTestId('summary-card-income-value')
    expect(incomeValue).toHaveTextContent('15.000,00')
    expect(incomeValue).toHaveTextContent('₺')
  })

  it('displays Toplam Gider with sum of all expenses', () => {
    render(<SummaryCard totalIncome={10000} totalExpense={7500} />)

    const expenseValue = screen.getByTestId('summary-card-expense-value')
    expect(expenseValue).toHaveTextContent('7.500,00')
    expect(expenseValue).toHaveTextContent('₺')
  })

  it('displays Bakiye with calculated difference (income - expense)', () => {
    render(<SummaryCard totalIncome={10000} totalExpense={6000} />)

    const balanceValue = screen.getByTestId('summary-card-balance-value')
    expect(balanceValue).toHaveTextContent('4.000,00')
    expect(balanceValue).toHaveTextContent('₺')
  })

  it('shows Bakiye in green when balance is positive', () => {
    render(<SummaryCard totalIncome={10000} totalExpense={5000} />)

    const balanceCard = screen.getByTestId('summary-card-balance')
    const balanceValue = screen.getByTestId('summary-card-balance-value')
    
    // Balance is positive (5000), so should use text-income class
    expect(balanceValue).toHaveClass('text-income')
    expect(balanceCard).toHaveClass('border-income/20')
  })

  it('shows Bakiye in red when balance is negative', () => {
    render(<SummaryCard totalIncome={5000} totalExpense={10000} />)

    const balanceCard = screen.getByTestId('summary-card-balance')
    const balanceValue = screen.getByTestId('summary-card-balance-value')
    
    // Balance is negative (-5000), so should use text-expense class
    expect(balanceValue).toHaveClass('text-expense')
    expect(balanceCard).toHaveClass('border-expense/20')
  })

  it('shows Bakiye in green when balance is exactly zero', () => {
    render(<SummaryCard totalIncome={5000} totalExpense={5000} />)

    const balanceValue = screen.getByTestId('summary-card-balance-value')
    
    // Balance is zero (neutral), treated as positive
    expect(balanceValue).toHaveClass('text-income')
  })

  it('formats values as Turkish Lira currency', () => {
    render(<SummaryCard totalIncome={1234567.89} totalExpense={0} />)

    const incomeValue = screen.getByTestId('summary-card-income-value')
    expect(incomeValue).toHaveTextContent('1.234.567,89')
    expect(incomeValue).toHaveTextContent('₺')
  })

  it('handles zero values correctly', () => {
    render(<SummaryCard totalIncome={0} totalExpense={0} />)

    expect(screen.getByTestId('summary-card-income-value')).toHaveTextContent('₺0,00')
    expect(screen.getByTestId('summary-card-expense-value')).toHaveTextContent('₺0,00')
    expect(screen.getByTestId('summary-card-balance-value')).toHaveTextContent('₺0,00')
  })

  it('renders as 3-card grid layout', () => {
    const { container } = render(<SummaryCard totalIncome={1000} totalExpense={500} />)
    
    const grid = container.firstChild
    expect(grid).toHaveClass('grid')
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('md:grid-cols-3')
  })

  it('displays icons for each card type', () => {
    render(<SummaryCard totalIncome={1000} totalExpense={500} />)
    
    // Each card should have an icon container (3 cards total)
    const cards = screen.getAllByTestId(/^summary-card-(income|expense|balance)$/)
    expect(cards).toHaveLength(3)
  })
})
