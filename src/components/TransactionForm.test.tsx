/**
 * TransactionForm Component Tests
 * US-004: Transaction Form Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionForm } from './TransactionForm'

describe('TransactionForm', () => {
  const mockSubmit = vi.fn()
  const mockCancel = vi.fn()

  beforeEach(() => {
    mockSubmit.mockClear()
    mockCancel.mockClear()
  })

  it('renders form with all required fields', () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    // Check form title
    expect(screen.getByText('İşlem Ekle')).toBeInTheDocument()

    // Check type toggle options
    expect(screen.getByText('Gelir')).toBeInTheDocument()
    expect(screen.getByText('Gider')).toBeInTheDocument()

    // Check amount input
    expect(screen.getByLabelText(/Tutar/i)).toBeInTheDocument()

    // Check category dropdown
    expect(screen.getByLabelText(/Kategori/i)).toBeInTheDocument()

    // Check date picker
    expect(screen.getByLabelText(/Tarih/i)).toBeInTheDocument()

    // Check description textarea
    expect(screen.getByLabelText(/Açıklama/i)).toBeInTheDocument()

    // Check buttons
    expect(screen.getByText('İptal')).toBeInTheDocument()
    expect(screen.getByText('Kaydet')).toBeInTheDocument()
  })

  it('shows expense categories by default', () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    const categorySelect = screen.getByLabelText(/Kategori/i)
    expect(categorySelect).toBeInTheDocument()

    // Should show expense categories
    const options = Array.from(categorySelect.querySelectorAll('option')).map(opt => opt.textContent)
    expect(options).toContain('Yemek')
    expect(options).toContain('Ulaşım')
    expect(options).toContain('Fatura')
    expect(options).toContain('Eğlence')
    expect(options).toContain('Sağlık')
    expect(options).toContain('Diğer Gider')
  })

  it('shows income categories when type is changed to income', async () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    // Click on Gelir (Income) option
    const incomeRadio = screen.getByLabelText('Gelir')
    await userEvent.click(incomeRadio)

    // Should now show income categories
    const categorySelect = screen.getByLabelText(/Kategori/i)
    const options = Array.from(categorySelect.querySelectorAll('option')).map(opt => opt.textContent)
    expect(options).toContain('Maaş')
    expect(options).toContain('Fırsat')
    expect(options).toContain('Yatırım')
    expect(options).toContain('Diğer Gelir')
  })

  it('resets category when type is changed', async () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    // Select a category first
    const categorySelect = screen.getByLabelText(/Kategori/i)
    await userEvent.selectOptions(categorySelect, 'yemek')
    expect(categorySelect).toHaveValue('yemek')

    // Change type to income
    const incomeRadio = screen.getByLabelText('Gelir')
    await userEvent.click(incomeRadio)

    // Category should be reset
    expect(categorySelect).toHaveValue('')
  })

  it('validates required amount field', async () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    // Submit without entering amount
    const submitButton = screen.getByText('Kaydet')
    await userEvent.click(submitButton)

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Tutar alanı zorunludur')).toBeInTheDocument()
    })

    // onSubmit should not be called
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('validates amount must be positive', async () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    const amountInput = screen.getByLabelText(/Tutar/i)
    
    // Enter negative value
    await userEvent.type(amountInput, '-100')
    await userEvent.tab()

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Geçerli bir pozitif sayı giriniz')).toBeInTheDocument()
    })

    // Clear and enter zero
    await userEvent.clear(amountInput)
    await userEvent.type(amountInput, '0')
    await userEvent.tab()

    await waitFor(() => {
      expect(screen.getByText('Geçerli bir pozitif sayı giriniz')).toBeInTheDocument()
    })
  })

  it('validates required category field', async () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    // Enter amount but no category
    const amountInput = screen.getByLabelText(/Tutar/i)
    await userEvent.type(amountInput, '100')

    // Submit
    const submitButton = screen.getByText('Kaydet')
    await userEvent.click(submitButton)

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Kategori seçimi zorunludur')).toBeInTheDocument()
    })

    // onSubmit should not be called
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('shows default date as today', () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    const dateInput = screen.getByLabelText(/Tarih/i)
    const today = new Date().toISOString().split('T')[0]
    
    expect(dateInput).toHaveValue(today)
  })

  it('submits form with valid data', async () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    // Enter amount
    const amountInput = screen.getByLabelText(/Tutar/i)
    await userEvent.type(amountInput, '150.50')

    // Select category
    const categorySelect = screen.getByLabelText(/Kategori/i)
    await userEvent.selectOptions(categorySelect, 'yemek')

    // Enter description
    const descriptionInput = screen.getByLabelText(/Açıklama/i)
    await userEvent.type(descriptionInput, 'Öğle yemeği')

    // Submit
    const submitButton = screen.getByText('Kaydet')
    await userEvent.click(submitButton)

    // onSubmit should be called with correct data
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1)
    })

    const submittedData = mockSubmit.mock.calls[0][0]
    expect(submittedData.type).toBe('expense')
    expect(submittedData.amount).toBe(150.50)
    expect(submittedData.category).toBe('yemek')
    expect(submittedData.description).toBe('Öğle yemeği')
    expect(submittedData.date).toBeInstanceOf(Date)
  })

  it('submits form with income data', async () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    // Change to income
    const incomeRadio = screen.getByLabelText('Gelir')
    await userEvent.click(incomeRadio)

    // Enter amount
    const amountInput = screen.getByLabelText(/Tutar/i)
    await userEvent.type(amountInput, '5000')

    // Select income category
    const categorySelect = screen.getByLabelText(/Kategori/i)
    await userEvent.selectOptions(categorySelect, 'maas')

    // Submit
    const submitButton = screen.getByText('Kaydet')
    await userEvent.click(submitButton)

    // onSubmit should be called with correct data
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1)
    })

    const submittedData = mockSubmit.mock.calls[0][0]
    expect(submittedData.type).toBe('income')
    expect(submittedData.amount).toBe(5000)
    expect(submittedData.category).toBe('maas')
  })

  it('calls onCancel when cancel button is clicked', async () => {
    render(<TransactionForm onSubmit={mockSubmit} onCancel={mockCancel} />)

    const cancelButton = screen.getByText('İptal')
    await userEvent.click(cancelButton)

    expect(mockCancel).toHaveBeenCalledTimes(1)
  })

  it('clears form after successful submission', async () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    // Enter data
    const amountInput = screen.getByLabelText(/Tutar/i)
    await userEvent.type(amountInput, '100')

    const categorySelect = screen.getByLabelText(/Kategori/i)
    await userEvent.selectOptions(categorySelect, 'yemek')

    const descriptionInput = screen.getByLabelText(/Açıklama/i)
    await userEvent.type(descriptionInput, 'Test description')

    // Submit
    const submitButton = screen.getByText('Kaydet')
    await userEvent.click(submitButton)

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })

    // Form should be reset - get fresh references to elements
    await waitFor(() => {
      expect(screen.getByLabelText(/Tutar/i)).toHaveValue(null)
      expect(screen.getByLabelText(/Kategori/i)).toHaveValue('')
      expect(screen.getByLabelText(/Açıklama/i)).toHaveValue('')
    })
  })

  it('accepts initial data', () => {
    const initialData = {
      type: 'income' as const,
      amount: '2500',
      category: 'maas' as const,
      description: 'Maaş ödemesi',
      date: '2024-01-15',
    }

    render(<TransactionForm onSubmit={mockSubmit} initialData={initialData} />)

    expect(screen.getByLabelText('Gelir')).toBeChecked()
    expect(screen.getByLabelText(/Tutar/i)).toHaveValue(2500)
    expect(screen.getByLabelText(/Kategori/i)).toHaveValue('maas')
    expect(screen.getByLabelText(/Açıklama/i)).toHaveValue('Maaş ödemesi')
    expect(screen.getByLabelText(/Tarih/i)).toHaveValue('2024-01-15')
  })

  it('displays button text as Kaydet (not Save)', () => {
    render(<TransactionForm onSubmit={mockSubmit} />)

    const submitButton = screen.getByText('Kaydet')
    expect(submitButton).toBeInTheDocument()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
  })
})
