/**
 * TransactionForm Component
 * US-004: Transaction Form Component
 * 
 * Features:
 * - Type toggle (Gelir/Gider)
 * - Amount input (numeric, required)
 * - Category dropdown (dynamic based on type)
 * - Description textarea (optional)
 * - Date picker (default: today)
 * - Save button with Turkish labels
 */

import React, { useState, useCallback } from 'react'
import type { TransactionType, CategoryKey, Transaction } from '../types'
import { getIncomeCategories, getExpenseCategories } from '../constants/categories'

export interface TransactionFormData {
  type: TransactionType
  amount: string
  category: CategoryKey | ''
  description: string
  date: string
}

export interface TransactionFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Omit<Transaction, 'id'>) => void
  onCancel?: () => void
  initialData?: Partial<TransactionFormData>
}

const initialFormState: TransactionFormData = {
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
}

export function TransactionForm({ onSubmit, onCancel, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    ...initialFormState,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const categories = formData.type === 'income' 
    ? getIncomeCategories() 
    : getExpenseCategories()

  const validateField = useCallback((name: keyof TransactionFormData, value: string | TransactionType): string => {
    switch (name) {
      case 'amount': {
        if (!value || value === '') {
          return 'Tutar alanı zorunludur'
        }
        const numValue = parseFloat(value as string)
        if (isNaN(numValue) || numValue <= 0) {
          return 'Geçerli bir pozitif sayı giriniz'
        }
        return ''
      }
      case 'category': {
        if (!value || value === '') {
          return 'Kategori seçimi zorunludur'
        }
        return ''
      }
      case 'date': {
        if (!value) {
          return 'Tarih alanı zorunludur'
        }
        return ''
      }
      default:
        return ''
    }
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    
    const amountError = validateField('amount', formData.amount)
    if (amountError) newErrors.amount = amountError
    
    const categoryError = validateField('category', formData.category)
    if (categoryError) newErrors.category = categoryError
    
    const dateError = validateField('date', formData.date)
    if (dateError) newErrors.date = dateError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, validateField])

  const handleChange = useCallback((field: keyof TransactionFormData, value: string | TransactionType) => {
    setFormData(prev => {
      // Reset category when type changes
      if (field === 'type') {
        return { ...prev, [field]: value, category: '' }
      }
      return { ...prev, [field]: value }
    })
    
    // Clear error when field is modified
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((field: keyof TransactionFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [formData, validateField])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ amount: true, category: true, date: true, description: true, type: true })
    
    if (!validateForm()) {
      return
    }

    onSubmit({
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category as CategoryKey,
      description: formData.description,
      date: new Date(formData.date),
    })

    // Reset form after successful submission
    setFormData(initialFormState)
    setTouched({})
    setErrors({})
  }, [formData, onSubmit, validateForm])

  const handleCancel = useCallback(() => {
    setFormData(initialFormState)
    setTouched({})
    setErrors({})
    onCancel?.()
  }, [onCancel])

  return (
    <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold font-heading text-slate-900 dark:text-white">İşlem Ekle</h2>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Type Toggle */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            İşlem Türü
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.type === 'income'
                  ? 'border-income bg-income/10 text-income'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={() => handleChange('type', 'income')}
                className="sr-only"
              />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold">Gelir</span>
            </label>
            <label
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.type === 'expense'
                  ? 'border-expense bg-expense/10 text-expense'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={() => handleChange('type', 'expense')}
                className="sr-only"
              />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <span className="font-semibold">Gider</span>
            </label>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Tutar
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₺</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              onBlur={() => handleBlur('amount')}
              placeholder="0,00"
              min="0.01"
              step="0.01"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.amount && touched.amount
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary'
              }`}
            />
          </div>
          {errors.amount && touched.amount && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="space-y-3">
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Kategori
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.category && touched.category
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary'
              }`}
            >
              <option value="">Kategori seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {errors.category && touched.category && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.category}
            </p>
          )}
        </div>

        {/* Date Picker */}
        <div className="space-y-3">
          <label htmlFor="date" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Tarih
          </label>
          <div className="relative">
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.date && touched.date
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary'
              }`}
            />
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {errors.date && touched.date && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.date}
            </p>
          )}
        </div>

        {/* Description Textarea */}
        <div className="space-y-3">
          <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Açıklama <span className="text-slate-400 font-normal">(İsteğe bağlı)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Harcama detaylarını buraya yazabilirsiniz..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kaydet
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${formData.type === 'income' ? 'bg-income' : 'bg-expense'}`} />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {formData.type === 'income' ? 'Gelir işlemi' : 'Gider işlemi'}
          </span>
        </div>
        <span className="text-xs text-slate-400">
          * Zorunlu alanlar
        </span>
      </div>
    </div>
  )
}
