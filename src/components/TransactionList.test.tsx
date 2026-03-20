/**
 * TransactionList Component Tests
 * US-005: Transaction List Component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TransactionList } from './TransactionList'
import type { Transaction } from '../types'

describe('TransactionList', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 45000,
      category: 'maas',
      description: 'Maaş Ödemesi',
      date: new Date('2023-10-12'),
    },
    {
      id: '2',
      type: 'expense',
      amount: 1240.50,
      category: 'yemek',
      description: 'Market Alışverişi',
      date: new Date('2023-10-15'),
    },
    {
      id: '3',
      type: 'expense',
      amount: 10000,
      category: 'fatura',
      description: 'Kira Ödemesi',
      date: new Date('2023-10-15'),
    },
    {
      id: '4',
      type: 'expense',
      amount: 2100,
      category: 'ulasim',
      description: 'Akaryakıt',
      date: new Date('2023-10-10'),
    },
  ]

  describe('Empty State', () => {
    it('displays empty state message when no transactions', () => {
      render(<TransactionList transactions={[]} />)
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      expect(screen.getByText('Henüz işlem eklemediniz')).toBeInTheDocument()
    })

    it('shows add button in empty state when onAddNew is provided', () => {
      const onAddNew = vi.fn()
      render(<TransactionList transactions={[]} onAddNew={onAddNew} />)
      
      const addButton = screen.getByTestId('add-first-transaction')
      expect(addButton).toBeInTheDocument()
      expect(addButton).toHaveTextContent('Yeni İşlem Ekle')
    })

    it('calls onAddNew when add button clicked in empty state', () => {
      const onAddNew = vi.fn()
      render(<TransactionList transactions={[]} onAddNew={onAddNew} />)
      
      const addButton = screen.getByTestId('add-first-transaction')
      fireEvent.click(addButton)
      
      expect(onAddNew).toHaveBeenCalledTimes(1)
    })
  })

  describe('Transaction Rendering', () => {
    it('renders transaction list when transactions exist', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument()
    })

    it('displays transactions in reverse chronological order', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      // Should group by date - 15 Ekim comes first (most recent)
      const dateGroups = screen.getAllByTestId(/date-group-/)
      expect(dateGroups.length).toBe(3) // 3 unique dates
      
      // First group should be 2023-10-15 (most recent with 2 transactions)
      expect(dateGroups[0]).toHaveTextContent('15 Ekim 2023')
      // Second group should be 2023-10-12
      expect(dateGroups[1]).toHaveTextContent('12 Ekim 2023')
      // Third group should be 2023-10-10
      expect(dateGroups[2]).toHaveTextContent('10 Ekim 2023')
    })

    it('renders each transaction with description', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      expect(screen.getByText('Maaş Ödemesi')).toBeInTheDocument()
      expect(screen.getByText('Market Alışverişi')).toBeInTheDocument()
      expect(screen.getByText('Kira Ödemesi')).toBeInTheDocument()
      expect(screen.getByText('Akaryakıt')).toBeInTheDocument()
    })

    it('renders category names for each transaction', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      expect(screen.getByText('Maaş')).toBeInTheDocument()
      expect(screen.getByText('Yemek')).toBeInTheDocument()
      expect(screen.getByText('Fatura')).toBeInTheDocument()
      expect(screen.getByText('Ulaşım')).toBeInTheDocument()
    })

    it('renders transaction type labels (Gelir/Gider)', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      const incomeLabels = screen.getAllByText('Gelir')
      const expenseLabels = screen.getAllByText('Gider')
      
      expect(incomeLabels.length).toBe(1) // 1 income
      expect(expenseLabels.length).toBe(3) // 3 expenses
    })
  })

  describe('Amount Formatting', () => {
    it('displays income amounts in green with + prefix', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      const incomeAmount = screen.getByTestId('amount-1')
      expect(incomeAmount).toHaveTextContent('+₺45.000,00')
      expect(incomeAmount).toHaveClass('text-income')
    })

    it('displays expense amounts in red with - prefix', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      const expenseAmount = screen.getByTestId('amount-2')
      expect(expenseAmount).toHaveTextContent('-₺1.240,50')
      expect(expenseAmount).toHaveClass('text-expense')
    })

    it('formats currency correctly for Turkish locale', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      // Check various amounts are formatted
      expect(screen.getByTestId('amount-1')).toHaveTextContent('₺')
      expect(screen.getByTestId('amount-2')).toHaveTextContent('₺')
      expect(screen.getByTestId('amount-3')).toHaveTextContent('-₺10.000,00')
    })
  })

  describe('Delete Button', () => {
    it('shows delete button when onDelete handler is provided', () => {
      const onDelete = vi.fn()
      render(<TransactionList transactions={mockTransactions} onDelete={onDelete} />)
      
      mockTransactions.forEach(transaction => {
        expect(screen.getByTestId(`delete-${transaction.id}`)).toBeInTheDocument()
      })
    })

    it('does not show delete button when onDelete is not provided', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      mockTransactions.forEach(transaction => {
        expect(screen.queryByTestId(`delete-${transaction.id}`)).not.toBeInTheDocument()
      })
    })

    it('calls onDelete with transaction id when delete button clicked', () => {
      const onDelete = vi.fn()
      render(<TransactionList transactions={mockTransactions} onDelete={onDelete} />)
      
      const deleteButton = screen.getByTestId('delete-2')
      fireEvent.click(deleteButton)
      
      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onDelete).toHaveBeenCalledWith('2')
    })

    it('delete buttons have correct aria-label', () => {
      const onDelete = vi.fn()
      render(<TransactionList transactions={mockTransactions} onDelete={onDelete} />)
      
      mockTransactions.forEach(transaction => {
        const deleteButton = screen.getByTestId(`delete-${transaction.id}`)
        expect(deleteButton).toHaveAttribute('aria-label', 'İşlemi sil')
      })
    })
  })

  describe('Date Grouping', () => {
    it('groups transactions by date', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      // 15 October group should have 2 transactions
      const oct15Group = screen.getByTestId('date-group-2023-10-15')
      expect(oct15Group).toBeInTheDocument()
      
      // Check both transactions from 15 Oct are in the same group
      const groupContainer = oct15Group.querySelector('.space-y-2')
      expect(groupContainer?.children.length).toBe(2)
    })

    it('formats dates correctly in Turkish', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      expect(screen.getByText('15 Ekim 2023')).toBeInTheDocument()
      expect(screen.getByText('12 Ekim 2023')).toBeInTheDocument()
      expect(screen.getByText('10 Ekim 2023')).toBeInTheDocument()
    })
  })

  describe('Transaction Items', () => {
    it('renders correct number of transaction items', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      mockTransactions.forEach(transaction => {
        expect(screen.getByTestId(`transaction-${transaction.id}`)).toBeInTheDocument()
      })
    })

    it('each transaction has proper styling classes', () => {
      render(<TransactionList transactions={mockTransactions} />)
      
      const firstTransaction = screen.getByTestId('transaction-1')
      expect(firstTransaction).toHaveClass('group', 'flex', 'items-center', 'gap-4')
    })
  })
})
