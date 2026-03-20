/**
 * TransactionList Component
 * US-005: Transaction List Component
 * 
 * Displays all transactions in reverse chronological order.
 * Each row shows: formatted date, category icon, description, amount.
 * Income amounts show in green with '+' prefix.
 * Expense amounts show in red with '-' prefix.
 * Delete button per row triggers confirmation.
 * Empty state shows message 'Henüz işlem eklemediniz' with icon.
 */

import type { FC } from 'react'
import { Trash2, Wallet, Home, ShoppingCart, Car, Utensils, Receipt, PartyPopper, HeartPulse, MoreHorizontal, Sparkles, TrendingUp, PlusCircle, History } from 'lucide-react'
import type { Transaction, CategoryKey } from '../types'
import { ALL_CATEGORIES } from '../constants/categories'
import { formatCurrency } from '../utils'

// Icon mapping for categories
type IconComponent = FC<{ className?: string }>
const categoryIcons: Record<string, IconComponent> = {
  wallet: Wallet,
  sparkles: Sparkles,
  'trending-up': TrendingUp,
  'plus-circle': PlusCircle,
  utensils: Utensils,
  car: Car,
  receipt: Receipt,
  'party-popper': PartyPopper,
  'heart-pulse': HeartPulse,
  'more-horizontal': MoreHorizontal,
  home: Home,
  'shopping-cart': ShoppingCart,
}

interface TransactionListProps {
  transactions: Transaction[]
  // eslint-disable-next-line no-unused-vars
  onDelete?: (id: string) => void
  onAddNew?: () => void
}

interface GroupedTransactions {
  [date: string]: Transaction[]
}

/**
 * Group transactions by date string (YYYY-MM-DD)
 */
function groupTransactionsByDate(transactions: Transaction[]): GroupedTransactions {
  const sorted = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return sorted.reduce((groups, transaction) => {
    const dateKey = new Date(transaction.date).toISOString().split('T')[0]
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(transaction)
    return groups
  }, {} as GroupedTransactions)
}

/**
 * Format date for display (e.g., "15 Ekim 2023")
 */
function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Get icon component for category
 */
function getCategoryIcon(categoryKey: CategoryKey): IconComponent {
  const category = ALL_CATEGORIES[categoryKey]
  if (!category) return MoreHorizontal
  return categoryIcons[category.icon] || MoreHorizontal
}

/**
 * Get color class for category icon background
 */
function getCategoryColorClass(categoryKey: CategoryKey): string {
  const category = ALL_CATEGORIES[categoryKey]
  if (!category) return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
  
  // Map category colors to Tailwind classes
  const colorMap: Record<string, string> = {
    '#22c55e': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    '#10b981': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    '#059669': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-400',
    '#047857': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-400',
    '#ef4444': 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    '#f97316': 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    '#eab308': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    '#a855f7': 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    '#ec4899': 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400',
    '#64748b': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  }
  
  return colorMap[category.color] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
}

export function TransactionList({ transactions, onDelete, onAddNew }: TransactionListProps) {
  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center" data-testid="empty-state">
        <div className="size-20 bg-slate-100 dark:bg-surface rounded-full flex items-center justify-center mb-4">
          <History className="text-4xl text-slate-400 w-10 h-10" />
        </div>
        <h3 className="text-lg font-semibold dark:text-white">Henüz işlem eklemediniz</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
          Eklediğiniz gelir ve giderler burada tarih bazlı listelenecektir.
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all cursor-pointer"
            data-testid="add-first-transaction"
          >
            Yeni İşlem Ekle
          </button>
        )}
      </div>
    )
  }

  const grouped = groupTransactionsByDate(transactions)
  const sortedDates = Object.keys(grouped).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="space-y-6" data-testid="transaction-list">
      {sortedDates.map((dateKey) => (
        <div key={dateKey} data-testid={`date-group-${dateKey}`}>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-2">
            {formatDisplayDate(dateKey)}
          </h3>
          <div className="space-y-2">
            {grouped[dateKey].map((transaction) => {
              const IconComponent = getCategoryIcon(transaction.category)
              const isIncome = transaction.type === 'income'
              const amountPrefix = isIncome ? '+' : '-'
              const amountColor = isIncome ? 'text-income' : 'text-expense'
              const iconColorClass = getCategoryColorClass(transaction.category)

              return (
                <div
                  key={transaction.id}
                  className="group flex items-center gap-4 bg-white dark:bg-surface p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className={`size-12 rounded-lg flex items-center justify-center ${iconColorClass}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {ALL_CATEGORIES[transaction.category]?.name || transaction.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-bold ${amountColor}`} data-testid={`amount-${transaction.id}`}>
                      {amountPrefix}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">
                      {isIncome ? 'Gelir' : 'Gider'}
                    </p>
                  </div>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-expense hover:bg-expense/10 rounded-lg transition-all duration-200 cursor-pointer"
                      data-testid={`delete-${transaction.id}`}
                      aria-label="İşlemi sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TransactionList
