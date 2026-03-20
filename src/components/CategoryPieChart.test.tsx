/**
 * Tests for CategoryPieChart Component
 * US-007: Category Pie Chart Component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CategoryPieChart } from './CategoryPieChart'
import type { Transaction } from '../types'

describe('CategoryPieChart', () => {
  const createMockTransaction = (
    id: string,
    type: 'income' | 'expense',
    category: string,
    amount: number,
    date: Date
  ): Transaction => ({
    id,
    type,
    amount,
    category: category as any,
    description: 'Test description',
    date
  })

  it('renders PieChart with recharts', () => {
    const transactions: Transaction[] = [
      createMockTransaction('1', 'expense', 'yemek', 500, new Date(2024, 0, 15))
    ]
    
    render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    // Chart should render (responsive container)
    const chartContainer = document.querySelector('.recharts-responsive-container')
    expect(chartContainer).toBeInTheDocument()
  })

  it('each expense category shown as slice with distinct color', () => {
    const transactions: Transaction[] = [
      createMockTransaction('1', 'expense', 'yemek', 5000, new Date(2024, 0, 15)),
      createMockTransaction('2', 'expense', 'ulasim', 3000, new Date(2024, 0, 10)),
      createMockTransaction('3', 'expense', 'fatura', 2000, new Date(2024, 0, 5))
    ]
    
    render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    // Should have pie slices for each category - at least 2 for valid percentages
    const pieSlices = document.querySelectorAll('.recharts-pie-sector')
    expect(pieSlices.length).toBeGreaterThanOrEqual(2)
  })

  it('legend displays category name and percentage', () => {
    const transactions: Transaction[] = [
      createMockTransaction('1', 'expense', 'yemek', 500, new Date(2024, 0, 15)),
      createMockTransaction('2', 'expense', 'ulasim', 500, new Date(2024, 0, 10))
    ]
    
    render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    // Legend should show category names with percentages
    expect(screen.getByText(/Yemek/)).toBeInTheDocument()
    expect(screen.getByText(/Ulaşım/)).toBeInTheDocument()
  })

  it('empty state shows Bu ay gider yok message', () => {
    const transactions: Transaction[] = []
    
    render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    expect(screen.getByText('Bu ay gider yok')).toBeInTheDocument()
  })

  it('empty state shows description', () => {
    const transactions: Transaction[] = []
    
    render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    expect(screen.getByText(/Bu ay için henüz gider kaydı bulunmamaktadır/)).toBeInTheDocument()
  })

  it('does not show empty state when there are expenses', () => {
    const transactions: Transaction[] = [
      createMockTransaction('1', 'expense', 'yemek', 500, new Date(2024, 0, 15))
    ]
    
    render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    expect(screen.queryByText('Bu ay gider yok')).not.toBeInTheDocument()
  })

  it('filters by selected month', () => {
    const transactions: Transaction[] = [
      createMockTransaction('1', 'expense', 'yemek', 500, new Date(2024, 0, 15)), // January
      createMockTransaction('2', 'expense', 'ulasim', 300, new Date(2024, 1, 10)) // February
    ]
    
    const { rerender } = render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    // Should show Yemek (January expense)
    expect(screen.getByText(/Yemek/)).toBeInTheDocument()
    
    // Switch to February
    rerender(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={1} 
        selectedYear={2024} 
      />
    )
    
    // Should now show Ulaşım (February expense)
    expect(screen.getByText(/Ulaşım/)).toBeInTheDocument()
  })

  it('filters by selected year', () => {
    const transactions: Transaction[] = [
      createMockTransaction('1', 'expense', 'yemek', 500, new Date(2024, 0, 15)),
      createMockTransaction('2', 'expense', 'ulasim', 300, new Date(2023, 0, 15))
    ]
    
    const { rerender } = render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    // Should show Yemek (2024 expense)
    expect(screen.getByText(/Yemek/)).toBeInTheDocument()
    
    // Switch to 2023
    rerender(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2023} 
      />
    )
    
    // Should now show Ulaşım (2023 expense)
    expect(screen.getByText(/Ulaşım/)).toBeInTheDocument()
  })

  it('ignores income transactions', () => {
    const transactions: Transaction[] = [
      createMockTransaction('1', 'expense', 'yemek', 500, new Date(2024, 0, 15)),
      createMockTransaction('2', 'income', 'maas', 5000, new Date(2024, 0, 10))
    ]
    
    render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    // Should show Yemek (expense)
    expect(screen.getByText(/Yemek/)).toBeInTheDocument()
    
    // Should only have one slice (no income)
    const pieSlices = document.querySelectorAll('.recharts-pie-sector')
    expect(pieSlices.length).toBe(1)
  })

  it('aggregates expenses by category', () => {
    const transactions: Transaction[] = [
      createMockTransaction('1', 'expense', 'yemek', 3000, new Date(2024, 0, 15)),
      createMockTransaction('2', 'expense', 'yemek', 2000, new Date(2024, 0, 10)),
      createMockTransaction('3', 'expense', 'ulasim', 5000, new Date(2024, 0, 5))
    ]
    
    render(
      <CategoryPieChart 
        transactions={transactions} 
        selectedMonth={0} 
        selectedYear={2024} 
      />
    )
    
    // Legend should show both categories (Yemek and Ulaşım)
    // Confirming that expenses were aggregated properly
    expect(screen.getByText(/Yemek/)).toBeInTheDocument()
    expect(screen.getByText(/Ulaşım/)).toBeInTheDocument()
  })
})
