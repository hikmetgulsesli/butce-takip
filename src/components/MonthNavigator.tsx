import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthNavigatorProps {
  currentDate: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
}

const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

export function MonthNavigator({ currentDate, onPreviousMonth, onNextMonth }: MonthNavigatorProps) {
  const monthName = monthNames[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPreviousMonth}
        className="p-2 rounded-xl bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        aria-label="Önceki ay"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="text-center min-w-[150px]">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-body uppercase tracking-wider">Seçili Dönem</span>
        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
          {monthName} {year}
        </h2>
      </div>
      <button
        onClick={onNextMonth}
        className="p-2 rounded-xl bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        aria-label="Sonraki ay"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
