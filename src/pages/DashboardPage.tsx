/**
 * DashboardPage - Main Dashboard
 * US-012: Integration Wiring & End-to-End Verification
 * 
 * Main dashboard with summary cards, category chart, and recent transactions
 * Implements screen: 7af73b4a20734d9895e9ec36228aee56 (Bütçe Takip Dashboard)
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks'
import { getCategory } from '../constants/categories'
import {
  Landmark,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Info,
  Plus,
  Home,
  ShoppingCart,
  Car,
  Receipt,
  Utensils,
  Wallet,
  Banknote,
  ArrowRight,
  MoreHorizontal,
  Heart
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  yemek: <Utensils className="w-4 h-4" />,
  ulasim: <Car className="w-4 h-4" />,
  fatura: <Receipt className="w-4 h-4" />,
  eglence: <Wallet className="w-4 h-4" />,
  saglik: <Heart className="w-4 h-4" />,
  'diger-gider': <MoreHorizontal className="w-4 h-4" />,
  maas: <Banknote className="w-4 h-4" />,
  firsat: <TrendingUp className="w-4 h-4" />,
  yatirim: <TrendingUp className="w-4 h-4" />,
  'diger-gelir': <MoreHorizontal className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
  shopping: <ShoppingCart className="w-4 h-4" />,
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#64748b']

export function DashboardPage() {
  const navigate = useNavigate()
  const { transactions, getIncomeTotal, getExpenseTotal, getBalance } = useTransactions()
  const [currentDate, setCurrentDate] = useState(new Date())

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  // Calculate totals
  const totalIncome = getIncomeTotal(currentYear, currentMonth)
  const totalExpense = getExpenseTotal(currentYear, currentMonth)
  const balance = getBalance(currentYear, currentMonth)

  // Get category breakdown for pie chart
  const categoryData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}
    
    transactions
      .filter(t => {
        const tDate = new Date(t.date)
        return tDate.getFullYear() === currentYear && 
               tDate.getMonth() === currentMonth && 
               t.type === 'expense'
      })
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount
      })

    return Object.entries(expensesByCategory)
      .map(([category, amount]) => {
        const cat = getCategory(category)
        return {
          name: cat?.name || category,
          value: amount,
          category
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 4)
  }, [transactions, currentYear, currentMonth])

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const tDate = new Date(t.date)
        return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [transactions, currentYear, currentMonth])

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleAddTransaction = () => {
    navigate('/ekle')
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white font-heading">
            Bütçe Takip
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-slate-100 dark:bg-surface rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button 
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              aria-label="Önceki Ay"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <span className="px-4 font-semibold text-sm text-slate-900 dark:text-white">{monthName}</span>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              aria-label="Sonraki Ay"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Income */}
        <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 font-medium font-body">Toplam Gelir</span>
            <div className="bg-income/10 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-income" />
            </div>
          </div>
          <div className="text-3xl font-bold text-income font-heading">{formatAmount(totalIncome)} TL</div>
          <div className="mt-2 text-sm text-income flex items-center gap-1 font-body">
            <ArrowUp className="w-3 h-3" />
            <span>Bu ay</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 font-medium font-body">Toplam Gider</span>
            <div className="bg-expense/10 p-2 rounded-lg">
              <TrendingDown className="w-5 h-5 text-expense" />
            </div>
          </div>
          <div className="text-3xl font-bold text-expense font-heading">{formatAmount(totalExpense)} TL</div>
          <div className="mt-2 text-sm text-expense flex items-center gap-1 font-body">
            <ArrowDown className="w-3 h-3" />
            <span>Bu ay</span>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 font-medium font-body">Bakiye</span>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Landmark className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className={`text-3xl font-bold font-heading ${balance >= 0 ? 'text-primary' : 'text-expense'}`}>
            {formatAmount(balance)} TL
          </div>
          <div className="mt-2 text-sm text-primary flex items-center gap-1 font-body">
            <Info className="w-3 h-3" />
            <span>Kalan bütçe</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Chart */}
        <div className="lg:col-span-1 bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 font-heading text-slate-900 dark:text-white">
            Kategori Bazlı Harcamalar
          </h2>
          <div className="relative h-64 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value.toLocaleString('tr-TR')} TL`}
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 rounded-full border-8 border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto">
                  <span className="text-slate-400 text-sm">Veri yok</span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3">
            {categoryData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-slate-700 dark:text-slate-300 font-body">{item.name}</span>
                </div>
                <span className="font-semibold font-heading text-slate-900 dark:text-white">
                  {((item.value / totalExpense) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-heading text-slate-900 dark:text-white">
              Son İşlemler
            </h2>
            <button
              onClick={handleAddTransaction}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              İşlem Ekle
            </button>
          </div>
          <div className="flex-grow overflow-x-auto">
            {recentTransactions.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 font-body">
                    <th className="pb-3 font-medium">Tarih</th>
                    <th className="pb-3 font-medium">Kategori</th>
                    <th className="pb-3 font-medium">Açıklama</th>
                    <th className="pb-3 font-medium text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentTransactions.map((transaction) => {
                    const category = getCategory(transaction.category)
                    const icon = categoryIcons[transaction.category] || categoryIcons['diger-gider']
                    
                    return (
                      <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-400 font-body">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.type === 'income' 
                                ? 'bg-income/10 text-income' 
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {icon}
                            </div>
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-body">
                              {category?.name || transaction.category}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-slate-600 dark:text-slate-400 font-body">
                          {transaction.description || '-'}
                        </td>
                        <td className={`py-4 text-sm font-bold text-right font-heading ${
                          transaction.type === 'income' ? 'text-income' : 'text-expense'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)} TL
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400 font-body">Henüz işlem bulunmuyor</p>
                <button 
                  onClick={handleAddTransaction}
                  className="mt-4 text-primary hover:text-primary/80 font-semibold text-sm cursor-pointer"
                >
                  İlk işlemi ekle
                </button>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
            <Link 
              to="/islemler" 
              className="text-primary hover:text-primary/80 font-semibold text-sm inline-flex items-center gap-1 transition-colors font-body"
            >
              Tümünü Gör
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
