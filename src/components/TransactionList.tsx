import { ArrowRight, Home, Wallet, Car, Utensils, ShoppingCart } from 'lucide-react'
import type { Transaction } from '../types'
import { getCategory } from '../constants/categories'
import { Link } from 'react-router-dom'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete?: (id: string) => void
  showViewAll?: boolean
}

const categoryIcons: Record<string, React.ReactNode> = {
  'yemek': <Utensils className="w-4 h-4" />,
  'ulasim': <Car className="w-4 h-4" />,
  'fatura': <Wallet className="w-4 h-4" />,
  'eglence': <ShoppingCart className="w-4 h-4" />,
  'saglik': <Wallet className="w-4 h-4" />,
  'default': <Home className="w-4 h-4" />
}

export function TransactionList({ transactions }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const getCategoryIcon = (categoryId: string) => {
    return categoryIcons[categoryId] || categoryIcons.default
  }

  const getCategoryColor = (type: string) => {
    return type === 'income' ? 'text-income bg-income/10' : 'text-expense bg-expense/10'
  }

  const getAmountColor = (type: string) => {
    return type === 'income' ? 'text-income' : 'text-expense'
  }

  const getAmountPrefix = (type: string) => {
    return type === 'income' ? '+' : '-'
  }

  return (
    <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold font-heading text-slate-900 dark:text-white">Son İşlemler</h2>
        <Link
          to="/transactions"
          className="text-primary hover:text-primary-dark font-semibold text-sm inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          Tümünü Gör
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 font-body">Henüz işlem eklenmemiş</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3 font-medium font-body">Tarih</th>
                <th className="pb-3 font-medium font-body">Kategori</th>
                <th className="pb-3 font-medium font-body">Açıklama</th>
                <th className="pb-3 font-medium text-right font-body">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((transaction) => {
                const category = getCategory(transaction.category)
                return (
                  <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 text-sm whitespace-nowrap text-slate-700 dark:text-slate-300 font-body">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCategoryColor(transaction.type)}`}>
                          {getCategoryIcon(transaction.category)}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-body">{category?.name || transaction.category}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-700 dark:text-slate-300 font-body">
                      {transaction.description || '-'}
                    </td>
                    <td className={`py-4 text-sm font-bold text-right font-heading ${getAmountColor(transaction.type)}`}>
                      {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
