import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '../utils'

interface SummaryCardProps {
  totalIncome: number
  totalExpense: number
}

/**
 * SummaryCard component showing monthly totals
 * - Toplam Gelir (Total Income)
 * - Toplam Gider (Total Expense)
 * - Bakiye (Balance = Income - Expense)
 */
export function SummaryCard({ totalIncome, totalExpense }: SummaryCardProps) {
  const balance = totalIncome - totalExpense
  const isPositive = balance >= 0

  const cards = [
    {
      id: 'income',
      label: 'Toplam Gelir',
      value: totalIncome,
      icon: TrendingUp,
      colorClass: 'text-income',
      bgClass: 'bg-income/10',
      borderClass: 'border-income/20',
    },
    {
      id: 'expense',
      label: 'Toplam Gider',
      value: totalExpense,
      icon: TrendingDown,
      colorClass: 'text-expense',
      bgClass: 'bg-expense/10',
      borderClass: 'border-expense/20',
    },
    {
      id: 'balance',
      label: 'Bakiye',
      value: balance,
      icon: Wallet,
      colorClass: isPositive ? 'text-income' : 'text-expense',
      bgClass: isPositive ? 'bg-income/10' : 'bg-expense/10',
      borderClass: isPositive ? 'border-income/20' : 'border-expense/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {cards.map((card) => {
        const IconComponent = card.icon
        return (
          <div
            key={card.id}
            data-testid={`summary-card-${card.id}`}
            className={`
              relative overflow-hidden rounded-2xl border p-6
              bg-white dark:bg-card-dark
              border-slate-200 dark:border-slate-700
              hover:scale-[1.02] transition-transform duration-200
              ${card.borderClass}
            `}
          >
            {/* Icon background decoration */}
            <div
              className={`
                absolute -right-4 -top-4 size-24 rounded-full opacity-20
                ${card.bgClass}
              `}
            />

            <div className="relative flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <p
                  data-testid={`summary-card-${card.id}-value`}
                  className={`
                    text-2xl font-bold tracking-tight
                    ${card.colorClass}
                  `}
                >
                  {formatCurrency(card.value)}
                </p>
              </div>

              <div
                className={`
                  flex items-center justify-center size-12 rounded-xl
                  ${card.bgClass} ${card.colorClass}
                `}
              >
                <IconComponent className="size-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
