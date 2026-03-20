/**
 * IslemListesiPage - Full Transaction List Page
 * US-012: Integration Wiring & End-to-End Verification
 * 
 * Shows all transactions with month navigation, delete functionality
 * Implements screen: 88b8ebceaff84d6584659153ed7c952f (Tüm İşlemler)
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks'
import { DeleteConfirmationDialog } from '../components/DeleteConfirmationDialog'
import { getCategory } from '../constants/categories'
import type { Transaction } from '../types'
import {
  ArrowLeft,
  Search,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Trash2,
  Home,
  ShoppingCart,
  Car,
  Receipt,
  Utensils,
  Wallet,
  TrendingUp,
  Heart,
  MoreHorizontal,
  Plus,
  History
} from 'lucide-react'

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  yemek: <Utensils className="w-5 h-5" />,
  ulasim: <Car className="w-5 h-5" />,
  fatura: <Receipt className="w-5 h-5" />,
  eglence: <Wallet className="w-5 h-5" />,
  saglik: <Heart className="w-5 h-5" />,
  'diger-gider': <MoreHorizontal className="w-5 h-5" />,
  maas: <Wallet className="w-5 h-5" />,
  firsat: <TrendingUp className="w-5 h-5" />,
  yatirim: <TrendingUp className="w-5 h-5" />,
  'diger-gelir': <MoreHorizontal className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  shopping: <ShoppingCart className="w-5 h-5" />,
}

// Category color mapping
const categoryColors: Record<string, string> = {
  yemek: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
  ulasim: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
  fatura: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  eglence: 'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400',
  saglik: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
  'diger-gider': 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400',
  maas: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
  firsat: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  yatirim: 'bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400',
  'diger-gelir': 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400',
  home: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
  shopping: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
}

export function IslemListesiPage() {
  const navigate = useNavigate()
  const { transactions, deleteTransaction } = useTransactions()
  const [currentDate, setCurrentDate] = useState(new Date())
  // TODO: Implement search functionality
  const [searchQuery] = useState('')
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  // Filter transactions by current month and search query
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const tDate = new Date(t.date)
        return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth
      })
      .filter(t => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        const category = getCategory(t.category)
        return (
          t.description.toLowerCase().includes(query) ||
          (category?.name || '').toLowerCase().includes(query)
        )
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, currentYear, currentMonth, searchQuery])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}
    filteredTransactions.forEach(t => {
      const dateKey = new Date(t.date).toISOString().split('T')[0]
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(t)
    })
    return groups
  }, [filteredTransactions])

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
  }

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id)
      setTransactionToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setTransactionToDelete(null)
  }

  const formatDate = (dateStr: string) => {
    const safeDateStr = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`
    const date = new Date(safeDateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return `${type === 'income' ? '+' : '-'}${formatted} TL`
  }

  const handleAddTransaction = () => {
    navigate('/ekle')
  }

  const handleGoBack = () => {
    navigate('/')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoBack}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
            aria-label="Geri"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white font-heading">
              Tüm İşlemler
            </h1>
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-primary cursor-pointer">Ana Sayfa</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary font-medium">İşlemler</span>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="p-2 bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label="Ara"
            onClick={() => {/* TODO: Implement search */}}
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            className="p-2 bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label="Filtrele"
            onClick={() => {/* TODO: Implement filter */}}
          >
            <ListFilter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-surface p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <button 
            onClick={handlePreviousMonth}
            className="flex items-center justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline ml-1 text-sm font-semibold">Önceki</span>
          </button>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-heading">{monthName}</h2>
          </div>
          <button 
            onClick={handleNextMonth}
            className="flex items-center justify-center p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <span className="hidden sm:inline mr-1 text-sm font-semibold">Sonraki</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction List */}
        {Object.keys(groupedTransactions).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => (
              <div key={dateKey}>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-2 font-body">
                  {formatDate(dateKey)}
                </h3>
                <div className="space-y-2">
                  {dayTransactions.map((transaction) => {
                    const category = getCategory(transaction.category)
                    const icon = categoryIcons[transaction.category] || categoryIcons['diger-gider']
                    const colorClass = categoryColors[transaction.category] || categoryColors['diger-gider']
                    
                    return (
                      <div 
                        key={transaction.id}
                        className="group flex items-center gap-4 bg-white dark:bg-surface p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className={`size-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-slate-900 dark:text-white truncate font-heading">
                            {category?.name || transaction.category}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-body">
                            {transaction.description || 'Açıklama yok'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-base font-bold font-heading ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                            {formatAmount(transaction.amount, transaction.type)}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-body">
                            {transaction.type === 'income' ? 'Gelir' : 'Gider'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(transaction)}
                          className="p-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all duration-200 cursor-pointer"
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
            <div className="size-20 bg-slate-100 dark:bg-surface rounded-full flex items-center justify-center mb-4">
              <History className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-heading">
              Henüz işlem eklemediniz
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs font-body">
              Eklediğiniz gelir ve giderler burada tarih bazlı listelenecektir.
            </p>
            <button 
              onClick={handleAddTransaction}
              className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all cursor-pointer"
            >
              Yeni İşlem Ekle
            </button>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={handleAddTransaction}
        className="fixed bottom-8 right-8 size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:scale-105 transition-transform duration-200 flex items-center justify-center z-30 cursor-pointer"
        aria-label="Yeni İşlem Ekle"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={transactionToDelete !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="İşlemi Sil?"
        message="İşlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  )
}
