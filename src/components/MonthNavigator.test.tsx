import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MonthNavigator } from './MonthNavigator'

afterEach(() => {
  cleanup()
})

describe('MonthNavigator', () => {
  const mockOnMonthChange = vi.fn()

  beforeEach(() => {
    mockOnMonthChange.mockClear()
  })

  describe('Display', () => {
    it('renders the component', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 0, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      expect(screen.getByTestId('month-navigator')).toBeInTheDocument()
    })

    it('displays current month in Turkish (Ocak)', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 0, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      expect(screen.getByTestId('month-display')).toHaveTextContent('Ocak 2026')
    })

    it('displays Şubat for February', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 1, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      expect(screen.getByTestId('month-display')).toHaveTextContent('Şubat 2026')
    })

    it('displays all Turkish month names correctly', () => {
      const expectedMonths = [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık',
      ]

      expectedMonths.forEach((month, index) => {
        const { rerender } = render(
          <MonthNavigator
            selectedDate={new Date(2026, index, 15)}
            onMonthChange={mockOnMonthChange}
          />
        )

        expect(screen.getByTestId('month-display')).toHaveTextContent(
          `${month} 2026`
        )

        rerender(<></>)
      })
    })

    it('renders previous and next month buttons', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 0, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      expect(screen.getByTestId('previous-month-button')).toBeInTheDocument()
      expect(screen.getByTestId('next-month-button')).toBeInTheDocument()
    })

    it('has correct aria labels for accessibility', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 0, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      expect(screen.getByTestId('previous-month-button')).toHaveAttribute(
        'aria-label',
        'Önceki Ay'
      )
      expect(screen.getByTestId('next-month-button')).toHaveAttribute(
        'aria-label',
        'Sonraki Ay'
      )
    })
  })

  describe('Navigation', () => {
    it('navigates to previous month when left arrow is clicked', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 5, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      fireEvent.click(screen.getByTestId('previous-month-button'))

      expect(mockOnMonthChange).toHaveBeenCalledTimes(1)
      const calledDate = mockOnMonthChange.mock.calls[0][0] as Date
      expect(calledDate.getMonth()).toBe(4) // May (0-indexed)
      expect(calledDate.getFullYear()).toBe(2026)
    })

    it('navigates to next month when right arrow is clicked', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 5, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      fireEvent.click(screen.getByTestId('next-month-button'))

      expect(mockOnMonthChange).toHaveBeenCalledTimes(1)
      const calledDate = mockOnMonthChange.mock.calls[0][0] as Date
      expect(calledDate.getMonth()).toBe(6) // July (0-indexed)
      expect(calledDate.getFullYear()).toBe(2026)
    })

    it('updates year correctly when crossing year boundary (January to December)', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 0, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      fireEvent.click(screen.getByTestId('previous-month-button'))

      expect(mockOnMonthChange).toHaveBeenCalledTimes(1)
      const calledDate = mockOnMonthChange.mock.calls[0][0] as Date
      expect(calledDate.getMonth()).toBe(11) // December
      expect(calledDate.getFullYear()).toBe(2025)
    })

    it('updates year correctly when crossing year boundary (December to January)', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 11, 15)}
          onMonthChange={mockOnMonthChange}
        />
      )

      fireEvent.click(screen.getByTestId('next-month-button'))

      expect(mockOnMonthChange).toHaveBeenCalledTimes(1)
      const calledDate = mockOnMonthChange.mock.calls[0][0] as Date
      expect(calledDate.getMonth()).toBe(0) // January
      expect(calledDate.getFullYear()).toBe(2027)
    })


  })

  describe('Props', () => {
    it('applies custom className', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 0, 15)}
          onMonthChange={mockOnMonthChange}
          className="custom-class"
        />
      )

      expect(screen.getByTestId('month-navigator')).toHaveClass('custom-class')
    })

    it('preserves the day of month when navigating', () => {
      render(
        <MonthNavigator
          selectedDate={new Date(2026, 5, 25)}
          onMonthChange={mockOnMonthChange}
        />
      )

      fireEvent.click(screen.getByTestId('next-month-button'))

      const calledDate = mockOnMonthChange.mock.calls[0][0] as Date
      expect(calledDate.getDate()).toBe(25)
    })
  })
})
