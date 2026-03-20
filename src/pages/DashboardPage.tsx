/**
 * Dashboard Page - US-010: Dashboard Page Integration
 * 
 * Integrates all components:
 * - SummaryCard (top)
 * - TransactionForm + recent 5 transactions (middle)
 * - CategoryPieChart + MonthNavigator (bottom)
 * - Responsive grid: 1 column mobile, 2+ columns tablet+
 * - "Tümünü Gör" link to full transaction list
 */

import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SummaryCard } from '../components/SummaryCard'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { CategoryPieChart } from '../components/CategoryPieChart'
import { MonthNavigator } from '../components/MonthNavigator'
import { useTransactions } from '../hooks'
import type { Transaction } from '../types'
import { Plus, Wallet, Settings, Bell } from 'lucide-react'

export function DashboardPage() {
  const {
    addTransaction,
    getTransactionsByMonth,
    getIncomeTotal,
    getExpenseTotal,
    getBalance
  } = useTransactions()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const monthTransactions = useMemo(() => {
    return getTransactionsByMonth(currentYear, currentMonth)
  }, [getTransactionsByMonth, currentYear, currentMonth])

  const recentTransactions = useMemo(() => {
    return [...monthTransactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5)
  }, [monthTransactions])

  const incomeTotal = useMemo(() => {
    return getIncomeTotal(currentYear, currentMonth)
  }, [getIncomeTotal, currentYear, currentMonth])

  const expenseTotal = useMemo(() => {
    return getExpenseTotal(currentYear, currentMonth)
  }, [getExpenseTotal, currentYear, currentMonth])

  const balance = useMemo(() => {
    return getBalance(currentYear, currentMonth)
  }, [getBalance, currentYear, currentMonth])

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }, [])

  const handleAddTransaction = useCallback((data: Omit<Transaction, 'id'>) => {
    addTransaction(data)
    setShowAddForm(false)
  }, [addTransaction])

  const handleCancelAdd = useCallback(() => {
    setShowAddForm(false)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white font-heading">
              Bütçe Takip
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              aria-label="Bildirimler"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-surface text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              aria-label="Ayarlar"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="mb-8">
          <SummaryCard
            totalIncome={incomeTotal}
            totalExpense={expenseTotal}
            balance={balance}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Column: Transaction Form */}
          <div className="lg:col-span-1">
            {showAddForm ? (
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={handleCancelAdd}
              />
            ) : (
              <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 font-heading">
                    Yeni İşlem Ekle
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 font-body">
                    Gelir veya gider kaydı oluşturmak için tıklayın.
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer w-full shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-5 h-5" />
                    İşlem Ekle
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Recent Transactions */}
          <div className="lg:col-span-2">
            <TransactionList transactions={recentTransactions} />
          </div>
        </div>

        {/* Bottom Section: Category Pie Chart with MonthNavigator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <MonthNavigator
                currentDate={currentDate}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
              />
            </div>
            <CategoryPieChart transactions={monthTransactions} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 font-heading text-slate-900 dark:text-white">
                Hızlı Erişim
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/transactions"
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white font-heading">Tüm İşlemler</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-body">İşlem geçmişini görüntüle</p>
                  </div>
                </Link>
                <Link
                  to="/add-transaction"
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-income/10 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-income" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white font-heading">İşlem Ekle</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-body">Yeni gelir/gider kaydı</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
