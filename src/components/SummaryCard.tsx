import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface SummaryCardProps {
  totalIncome: number
  totalExpense: number
  balance: number
}

export function SummaryCard({ totalIncome, totalExpense, balance }: SummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Income Card */}
      <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 dark:text-slate-400 font-medium font-body">Toplam Gelir</span>
          <div className="bg-income/10 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-income" />
          </div>
        </div>
        <div className="text-3xl font-bold text-income font-heading">
          {formatCurrency(totalIncome)}
        </div>
        <div className="mt-2 text-sm text-income flex items-center gap-1">
          <span className="text-xs">↑</span>
          <span>Aylık gelir</span>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 dark:text-slate-400 font-medium font-body">Toplam Gider</span>
          <div className="bg-expense/10 p-2 rounded-lg">
            <TrendingDown className="w-5 h-5 text-expense" />
          </div>
        </div>
        <div className="text-3xl font-bold text-expense font-heading">
          {formatCurrency(totalExpense)}
        </div>
        <div className="mt-2 text-sm text-expense flex items-center gap-1">
          <span className="text-xs">↓</span>
          <span>Aylık gider</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 dark:text-slate-400 font-medium font-body">Bakiye</span>
          <div className="bg-primary/10 p-2 rounded-lg">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className={`text-3xl font-bold font-heading ${balance >= 0 ? 'text-primary' : 'text-expense'}`}>
          {formatCurrency(balance)}
        </div>
        <div className={`mt-2 text-sm flex items-center gap-1 ${balance >= 0 ? 'text-primary' : 'text-expense'}`}>
          <span className="text-xs">ℹ</span>
          <span>{balance >= 0 ? 'Pozitif bakiye' : 'Negatif bakiye'}</span>
        </div>
      </div>
    </div>
  )
}
