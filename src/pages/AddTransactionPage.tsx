/**
 * Add Transaction Page
 * US-004: Transaction Form Component
 * 
 * Implements screen: 6576439802f14f38baea6f2a9e341028 (Ay Gezgini)
 * Shows the transaction form in a full page context
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransactionForm } from '../components/TransactionForm'
import type { Transaction } from '../types'

export function AddTransactionPage() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Omit<Transaction, 'id'>[]>([])

  const handleSubmit = (data: Omit<Transaction, 'id'>) => {
    // Add transaction to local state
    setTransactions(prev => [...prev, data])
    
    // Show success feedback (in a real app, this would be a toast)
    console.log('Transaction saved:', data)
    
    // Navigate back to dashboard
    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  // Calculate summary from transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpense

  const currentMonth = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 md:px-10 lg:px-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Bütçe Takip</h2>
            <p className="font-body text-xs text-slate-500 dark:text-slate-400">Finansal Özgürlük</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
            aria-label="Ayarlar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button 
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
            aria-label="Profil"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-12 px-4 md:px-10 lg:px-40">
        {/* Month Navigator */}
        <div className="w-full max-w-4xl mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-2">İşlem Ekle</h1>
              <p className="font-body text-slate-500 dark:text-slate-400">Yeni gelir veya gider kaydı oluşturun.</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-body font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{currentMonth}</span>
            </div>
          </div>

          {/* Month Navigation Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 gap-4">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-pointer group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-body font-bold text-sm uppercase tracking-wider">Önceki Ay</span>
              </button>
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-body text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">Seçili Dönem</span>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  {currentMonth}
                </h2>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-pointer group">
                <span className="font-body font-bold text-sm uppercase tracking-wider">Sonraki Ay</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-income/10 text-income">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="font-body font-bold text-slate-500 dark:text-slate-400">Gelir</span>
              </div>
              <p className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                ₺{totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-expense/10 text-expense">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <span className="font-body font-bold text-slate-500 dark:text-slate-400">Gider</span>
              </div>
              <p className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                ₺{totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <span className="font-body font-bold text-primary">Kalan</span>
              </div>
              <p className={`font-heading text-2xl font-bold ${balance >= 0 ? 'text-primary' : 'text-expense'}`}>
                ₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Transaction Form */}
          <div className="flex justify-center">
            <TransactionForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        </div>

        {/* Recent Transactions Summary */}
        {transactions.length > 0 && (
          <div className="w-full max-w-4xl mt-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-6">
                Son Eklenen İşlemler ({transactions.length})
              </h3>
              <div className="space-y-3">
                {transactions.slice(-5).map((t, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-income' : 'bg-expense'}`} />
                      <span className="font-body text-slate-700 dark:text-slate-300">{t.description || 'İşlem'}</span>
                    </div>
                    <span className={`font-heading font-bold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {t.type === 'income' ? '+' : '-'}₺{t.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 md:px-10 lg:px-40 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="font-body text-sm text-slate-500 dark:text-slate-400">
          © 2026 Bütçe Takip Sistemi - Tüm Hakları Saklıdır.
        </p>
      </footer>
    </div>
  )
}
