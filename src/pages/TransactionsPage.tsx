/**
 * Transactions Page - Full Transaction List View
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactions } from '../hooks'
import { DeleteConfirmationDialog } from '../components/DeleteConfirmationDialog'
import { ArrowLeft, Trash2, Home, Wallet, Car, Utensils, ShoppingCart } from 'lucide-react'
import { getCategory } from '../constants/categories'

const categoryIcons: Record<string, React.ReactNode> = {
  'yemek': <Utensils className="w-4 h-4" />,
  'ulasim': <Car className="w-4 h-4" />,
  'fatura': <Wallet className="w-4 h-4" />,
  'eglence': <ShoppingCart className="w-4 h-4" />,
  'saglik': <Wallet className="w-4 h-4" />,
  'maas': <Wallet className="w-4 h-4" />,
  'default': <Home className="w-4 h-4" />
}

export function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

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

  const getAmountColor = (type: string) => {
    return type === 'income' ? 'text-income' : 'text-expense'
  }

  const getAmountPrefix = (type: string) => {
    return type === 'income' ? '+' : '-'
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteTransaction(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white font-heading">
              Tüm İşlemler
            </h1>
          </div>
        </header>

        {/* Transaction List */}
        <div className="bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {sortedTransactions.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-500 dark:text-slate-400 font-body">Henüz işlem eklenmemiş</p>
              <Link
                to="/add-transaction"
                className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                İşlem Ekle
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedTransactions.map((transaction) => {
                const category = getCategory(transaction.category)
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income'
                          ? 'bg-income/10 text-income'
                          : 'bg-expense/10 text-expense'
                      }`}>
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white font-heading">
                          {category?.name || transaction.category}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-body">
                          {formatDate(transaction.date)}
                        </p>
                        {transaction.description && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-body">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold font-heading ${getAmountColor(transaction.type)}`}>
                        {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                      </span>
                      <button
                        onClick={() => setDeleteId(transaction.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-expense hover:bg-expense/10 transition-colors cursor-pointer"
                        aria-label="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
