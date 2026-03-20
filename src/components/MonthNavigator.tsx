import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Turkish month names
 */
const TURKISH_MONTHS = [
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

/**
 * Props for MonthNavigator component
 */
interface MonthNavigatorProps {
  /** Current selected date */
  selectedDate: Date
  /** Callback when month changes */
  onMonthChange: (date: Date) => void
  /** Optional CSS class */
  className?: string
}

/**
 * MonthNavigator component
 * 
 * Displays current month/year in Turkish format with navigation arrows.
 * Clicking arrows navigates to previous/next month and updates parent state.
 * 
 * @example
 * ```tsx
 * const [selectedDate, setSelectedDate] = useState(() => new Date())
 * <MonthNavigator
 *   selectedDate={selectedDate}
 *   onMonthChange={setSelectedDate}
 * />
 * ```
 */
export function MonthNavigator({
  selectedDate,
  onMonthChange,
  className = '',
}: MonthNavigatorProps) {
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  const monthName = TURKISH_MONTHS[currentMonth]
  const displayText = `${monthName} ${currentYear}`

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(currentMonth - 1)
    onMonthChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(currentMonth + 1)
    onMonthChange(newDate)
  }

  return (
    <div
      className={`flex items-center justify-center gap-4 ${className}`}
      data-testid="month-navigator"
    >
      <button
        onClick={handlePreviousMonth}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Önceki Ay"
        data-testid="previous-month-button"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
          Önceki Ay
        </span>
      </button>

      <h2
        className="flex items-center gap-3 text-xl sm:text-2xl font-heading font-semibold text-slate-900 dark:text-white min-w-[160px] justify-center"
        data-testid="month-display"
      >
        {displayText}
      </h2>

      <button
        onClick={handleNextMonth}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Sonraki Ay"
        data-testid="next-month-button"
      >
        <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
          Sonraki Ay
        </span>
        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      </button>
    </div>
  )
}
