/**
 * Tests for IslemListesiPage
 * US-011: Full Transaction List View & Error Pages
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { IslemListesiPage } from './IslemListesiPage'

const mockDeleteTransaction = vi.fn()

// Mock the hooks
vi.mock('../hooks', () => ({
  useTransactions: () => ({
    transactions: [
      {
        id: '1',
        type: 'expense',
        amount: 150.50,
        category: 'yemek',
        description: 'Öğle yemeği',
        date: '2026-03-15'
      },
      {
        id: '2',
        type: 'income',
        amount: 50000,
        category: 'maas',
        description: 'Mart maaşı',
        date: '2026-03-01'
      },
      {
        id: '3',
        type: 'expense',
        amount: 200,
        category: 'ulasim',
        description: 'Taksi',
        date: '2026-03-15'
      }
    ],
    deleteTransaction: mockDeleteTransaction,
    getTransactionsByMonth: vi.fn((year, month) => {
      if (year === 2026 && month === 2) { // March (0-indexed)
        return [
          {
            id: '1',
            type: 'expense',
            amount: 150.50,
            category: 'yemek',
            description: 'Öğle yemeği',
            date: '2026-03-15'
          },
          {
            id: '2',
            type: 'income',
            amount: 50000,
            category: 'maas',
            description: 'Mart maaşı',
            date: '2026-03-01'
          },
          {
            id: '3',
            type: 'expense',
            amount: 200,
            category: 'ulasim',
            description: 'Taksi',
            date: '2026-03-15'
          }
        ]
      }
      return []
    })
  })
}))

describe('IslemListesiPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-20'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders page title correctly', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Tüm İşlemler')).toBeInTheDocument()
  })

  it('displays month navigator', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Mart 2026')).toBeInTheDocument()
    expect(screen.getByText('Önceki')).toBeInTheDocument()
    expect(screen.getByText('Sonraki')).toBeInTheDocument()
  })

  it('displays transactions for selected month', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    // Check if transactions are displayed
    expect(screen.getByText('Öğle yemeği')).toBeInTheDocument()
    expect(screen.getByText('Mart maaşı')).toBeInTheDocument()
    expect(screen.getByText('Taksi')).toBeInTheDocument()
  })

  it('shows search input', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    expect(screen.getByPlaceholderText('İşlem ara...')).toBeInTheDocument()
  })

  it('has functional delete button for transactions', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    // Find delete buttons (they should be in the document)
    const deleteButtons = screen.getAllByLabelText('Sil')
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('opens delete confirmation dialog and calls deleteTransaction on confirm', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    // Click the first delete button
    const deleteButtons = screen.getAllByLabelText('Sil')
    fireEvent.click(deleteButtons[0])
    
    // Dialog should be visible
    expect(screen.getByText('İşlemi Sil?')).toBeInTheDocument()
    expect(screen.getByText('Bu işlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')).toBeInTheDocument()
    
    // Click confirm button
    const confirmButton = screen.getByText('Sil')
    fireEvent.click(confirmButton)
    
    // deleteTransaction should have been called
    expect(mockDeleteTransaction).toHaveBeenCalledWith('1')
  })

  it('displays transaction list when transactions exist', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    // Verify transactions are shown (not empty state)
    expect(screen.getByText('Öğle yemeği')).toBeInTheDocument()
    expect(screen.queryByText('Henüz işlem eklemediniz')).not.toBeInTheDocument()
  })

  it('has add new transaction button', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    expect(screen.getByLabelText('Yeni İşlem Ekle')).toBeInTheDocument()
  })

  it('displays transaction amounts correctly', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    // Check for formatted amounts (with Turkish formatting)
    expect(screen.getByText(/150,50/)).toBeInTheDocument()
    expect(screen.getByText(/50.000,00/)).toBeInTheDocument()
  })

  it('displays transaction categories', () => {
    render(
      <BrowserRouter>
        <IslemListesiPage />
      </BrowserRouter>
    )
    
    // Check category names are displayed
    expect(screen.getByText('Yemek')).toBeInTheDocument()
    expect(screen.getByText('Maaş')).toBeInTheDocument()
    expect(screen.getByText('Ulaşım')).toBeInTheDocument()
  })
})
