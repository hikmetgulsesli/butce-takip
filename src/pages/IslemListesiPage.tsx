/**
 * Islem Listesi (Transaction List View) Page
 * US-011: Full Transaction List View & Error Pages
 * 
 * Shows all transactions for selected month with full scroll.
 * Implements screen: 88b8ebceaff84d6584659153ed7c952f (Tüm İşlemler)
 */

import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Search, ListFilter, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react'
import { useTransactions } from '../hooks'
import { DeleteConfirmationDialog } from '../components/DeleteConfirmationDialog'
import { ALL_CATEGORIES } from '../constants/categories'
import type { Transaction } from '../types'

const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

const CATEGORY_ICONS: Record<string, string> = {
  yemek: '🍽️',
  ulasim: '🚗',
  fatura: '📄',
  eglence: '🎉',
  saglik: '🏥',
  'diger-gider': '📦',
  maas: '💼',
  firsat: '✨',
  yatirim: '📈',
  'diger-gelir': '➕'
}

export function IslemListesiPage() {
  const navigate = useNavigate()
  const { deleteTransaction, getTransactionsByMonth } = useTransactions()
  
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)

  // Get transactions for the selected month
  const monthTransactions = useMemo(() => {
    return getTransactionsByMonth(currentYear, currentMonth)
  }, [getTransactionsByMonth, currentYear, currentMonth])

  // Filter transactions by search term
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return monthTransactions
    const term = searchTerm.toLowerCase()
    return monthTransactions.filter(t => 
      t.description.toLowerCase().includes(term) ||
      ALL_CATEGORIES[t.category]?.name.toLowerCase().includes(term)
    )
  }, [monthTransactions, searchTerm])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}
    filteredTransactions.forEach(t => {
      const date = new Date(t.date)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateKey = `${year}-${month}-${day}`
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(t)
    })
    // Sort by date descending
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filteredTransactions])

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id)
      setTransactionToDelete(null)
    }
  }

  const formatDateTR = (dateStr: string) => {
    const [yearStr, monthStr, dayStr] = dateStr.split('-')
    const year = Number(yearStr)
    const month = Number(monthStr)
    const day = Number(dayStr)
    return `${day} ${MONTHS_TR[month - 1]} ${year}`
  }

  const monthName = `${MONTHS_TR[currentMonth]} ${currentYear}`

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Geri"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              Tüm İşlemler
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-lg bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
              aria-label="Ara"
              onClick={() => setSearchTerm(searchTerm => searchTerm ? '' : searchTerm)}
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="p-2 rounded-lg bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
              aria-label="Filtrele"
              onClick={() => {}}
            >
              <ListFilter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-8 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button 
            onClick={handlePreviousMonth}
            className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Önceki</span>
          </button>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-heading">
            {monthName}
          </h2>
          <button 
            onClick={handleNextMonth}
            className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline text-sm font-medium">Sonraki</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İşlem ara..."
              className="w-full h-12 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Transactions List */}
        {groupedTransactions.length > 0 ? (
          <div className="space-y-6">
            {groupedTransactions.map(([date, dayTransactions]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-2 mb-3">
                  {formatDateTR(date)}
                </h3>
                <div className="space-y-3">
                  {dayTransactions.map((transaction) => {
                    const category = ALL_CATEGORIES[transaction.category]
                    const isIncome = transaction.type === 'income'
                    
                    return (
                      <div 
                        key={transaction.id}
                        className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30 dark:hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-lg">
                          {CATEGORY_ICONS[transaction.category] || '📦'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {transaction.description || category?.name || 'İşlem'}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {category?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold font-heading ${isIncome ? 'text-income' : 'text-expense'}`}>
                            {isIncome ? '+' : '-'}₺{transaction.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(transaction)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                          aria-label="Sil"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Henüz işlem eklemediniz
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
              Bu ay için henüz kaydedilmiş bir işlem bulunmuyor.
            </p>
            <Link 
              to="/islem-ekle"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Yeni İşlem Ekle
            </Link>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Link 
        to="/islem-ekle"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-all hover:scale-105"
        aria-label="Yeni İşlem Ekle"
      >
        <Plus className="w-6 h-6" />
      </Link>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setTransactionToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="İşlemi Sil?"
        message="Bu işlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  )
}
