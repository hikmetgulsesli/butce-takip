/**
 * Custom React hooks for budget tracking app
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Transaction } from '../types'

/**
 * Hook for managing local storage state with SSR safety
 * Returns stored value and setter with localStorage sync
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  // Use a ref to track the current value for functional updates
  const storedValueRef = useRef(storedValue)
  
  useEffect(() => {
    storedValueRef.current = storedValue
  }, [storedValue])

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((newValue: T | ((prevValue: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = newValue instanceof Function 
        ? newValue(storedValueRef.current) 
        : newValue
      storedValueRef.current = valueToStore
      setStoredValue(valueToStore)
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }, [key])

  return [storedValue, setValue]
}

/**
 * Hook for managing dark theme
 */
export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  const toggle = useCallback(() => {
    setIsDark(prevIsDark => {
      const next = !prevIsDark
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }, [])

  return [isDark, toggle]
}

// Storage key for transactions
const TRANSACTIONS_STORAGE_KEY = 'butce-takip-transactions'

/**
 * Parse a transaction date - handles both Date objects and ISO date strings
 */
function parseTransactionDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date
  }
  return new Date(date)
}

/**
 * Hook for managing transactions with localStorage persistence
 * Provides CRUD operations and filtering by month
 */
export interface UseTransactionsReturn {
  transactions: Transaction[]
  addTransaction: (transactionData: Omit<Transaction, 'id'>) => void
  deleteTransaction: (transactionId: string) => void
  getTransactionsByMonth: (targetYear: number, targetMonth: number) => Transaction[]
  getIncomeTotal: (targetYear: number, targetMonth: number) => number
  getExpenseTotal: (targetYear: number, targetMonth: number) => number
  getBalance: (targetYear: number, targetMonth: number) => number
}

export function useTransactions(): UseTransactionsReturn {
  // Use localStorage for persistent transaction storage
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    TRANSACTIONS_STORAGE_KEY,
    []
  )

  /**
   * Add a new transaction
   * Generates a unique ID for the transaction
   */
  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateTransactionId(),
    }
    // Use functional update to ensure we have the latest state
    setTransactions((prevTransactions: Transaction[]) => [...prevTransactions, newTransaction])
  }, [setTransactions])

  /**
   * Delete a transaction by ID
   */
  const deleteTransaction = useCallback((transactionId: string) => {
    setTransactions((prevTransactions: Transaction[]) => 
      prevTransactions.filter(t => t.id !== transactionId)
    )
  }, [setTransactions])

  /**
   * Get transactions filtered by year and month
   * Month is 0-indexed (0 = January, 11 = December)
   */
  const getTransactionsByMonth = useCallback((targetYear: number, targetMonth: number): Transaction[] => {
    return transactions.filter(t => {
      const date = parseTransactionDate(t.date)
      return date.getFullYear() === targetYear && date.getMonth() === targetMonth
    })
  }, [transactions])

  /**
   * Calculate total income for a specific month
   */
  const getIncomeTotal = useCallback((targetYear: number, targetMonth: number): number => {
    return transactions
      .filter(t => {
        const date = parseTransactionDate(t.date)
        return date.getFullYear() === targetYear && 
               date.getMonth() === targetMonth && 
               t.type === 'income'
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  /**
   * Calculate total expenses for a specific month
   */
  const getExpenseTotal = useCallback((targetYear: number, targetMonth: number): number => {
    return transactions
      .filter(t => {
        const date = parseTransactionDate(t.date)
        return date.getFullYear() === targetYear && 
               date.getMonth() === targetMonth && 
               t.type === 'expense'
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  /**
   * Calculate balance (income - expenses) for a specific month
   */
  const getBalance = useCallback((targetYear: number, targetMonth: number): number => {
    return getIncomeTotal(targetYear, targetMonth) - getExpenseTotal(targetYear, targetMonth)
  }, [getIncomeTotal, getExpenseTotal])

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getTransactionsByMonth,
    getIncomeTotal,
    getExpenseTotal,
    getBalance,
  }
}

/**
 * Generate a unique transaction ID
 * Uses timestamp + random for uniqueness
 */
function generateTransactionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
