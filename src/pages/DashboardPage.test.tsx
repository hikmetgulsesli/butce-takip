import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { DashboardPage } from '../pages/DashboardPage'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('[]')
  })

  it('renders SummaryCard with current month totals', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    // Check that summary cards are rendered
    expect(screen.getByText('Toplam Gelir')).toBeInTheDocument()
    expect(screen.getByText('Toplam Gider')).toBeInTheDocument()
    expect(screen.getByText('Bakiye')).toBeInTheDocument()
  })

  it('shows TransactionForm trigger button', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    // Use role to find the specific button
    const buttons = screen.getAllByText('İşlem Ekle')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('opens TransactionForm when button is clicked', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    // Find button by role and click it
    const addButton = screen.getAllByText('İşlem Ekle').find(
      el => el.tagName.toLowerCase() === 'button'
    )
    expect(addButton).toBeDefined()
    if (addButton) {
      fireEvent.click(addButton)
      expect(screen.getByText('Kaydet')).toBeInTheDocument()
    }
  })

  it('shows Son İşlemler section', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Son İşlemler')).toBeInTheDocument()
  })

  it('has Tümünü Gör link', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Tümünü Gör')).toBeInTheDocument()
  })

  it('renders CategoryPieChart section', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Kategori Bazlı Harcamalar')).toBeInTheDocument()
  })

  it('MonthNavigator is functional', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    const prevButton = screen.getByLabelText('Önceki ay')
    const nextButton = screen.getByLabelText('Sonraki ay')

    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('renders with dark theme background', () => {
    const { container } = render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    const mainContainer = container.querySelector('.min-h-screen')
    expect(mainContainer).toHaveClass('bg-[#0f172a]')
  })

  it('displays month and year in navigator', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    // Should show current month
    const date = new Date()
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ]
    const currentMonthName = monthNames[date.getMonth()]
    expect(screen.getByText(`${currentMonthName} ${date.getFullYear()}`)).toBeInTheDocument()
  })
})
