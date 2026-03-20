import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MonthNavigator } from '../components/MonthNavigator'

describe('MonthNavigator', () => {
  it('renders current month and year', () => {
    const date = new Date(2026, 2, 15) // March 2026
    render(
      <MonthNavigator
        currentDate={date}
        onPreviousMonth={vi.fn()}
        onNextMonth={vi.fn()}
      />
    )

    expect(screen.getByText('Mart 2026')).toBeInTheDocument()
  })

  it('calls onPreviousMonth when previous button is clicked', () => {
    const onPreviousMonth = vi.fn()
    const date = new Date(2026, 2, 15)

    render(
      <MonthNavigator
        currentDate={date}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={vi.fn()}
      />
    )

    const prevButton = screen.getByLabelText('Önceki ay')
    fireEvent.click(prevButton)

    expect(onPreviousMonth).toHaveBeenCalledTimes(1)
  })

  it('calls onNextMonth when next button is clicked', () => {
    const onNextMonth = vi.fn()
    const date = new Date(2026, 2, 15)

    render(
      <MonthNavigator
        currentDate={date}
        onPreviousMonth={vi.fn()}
        onNextMonth={onNextMonth}
      />
    )

    const nextButton = screen.getByLabelText('Sonraki ay')
    fireEvent.click(nextButton)

    expect(onNextMonth).toHaveBeenCalledTimes(1)
  })

  it('displays all month names in Turkish', () => {
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ]

    monthNames.forEach((monthName, index) => {
      const date = new Date(2026, index, 15)
      const { unmount } = render(
        <MonthNavigator
          currentDate={date}
          onPreviousMonth={vi.fn()}
          onNextMonth={vi.fn()}
        />
      )

      expect(screen.getByText(`${monthName} 2026`)).toBeInTheDocument()
      unmount()
    })
  })
})
