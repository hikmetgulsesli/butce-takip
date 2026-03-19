/**
 * Type definitions for Budget Tracking Application
 * US-002: Design Tokens, Types & Categories
 */

/**
 * Transaction type - either income or expense
 */
export type TransactionType = 'income' | 'expense'

/**
 * Transaction interface representing a single income or expense entry
 */
export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: CategoryKey
  description: string
  date: Date
}

/**
 * Category definition for income/expense categories
 */
export interface Category {
  id: CategoryKey
  name: string
  icon: string
  color: string
  type: TransactionType
}

/**
 * Income category keys
 */
export type IncomeCategoryKey = 'maas' | 'firsat' | 'yatirim' | 'diger-gelir'

/**
 * Expense category keys
 */
export type ExpenseCategoryKey = 
  | 'yemek' 
  | 'ulasim' 
  | 'fatura' 
  | 'eglence' 
  | 'saglik' 
  | 'diger-gider'

/**
 * All category keys combined
 */
export type CategoryKey = IncomeCategoryKey | ExpenseCategoryKey

/**
 * Monthly summary data
 */
export interface MonthlySummary {
  month: number
  year: number
  totalIncome: number
  totalExpense: number
  balance: number
}

/**
 * Application state - central state management type
 * Renamed from BudgetState to AppState as per US-002
 */
export interface AppState {
  transactions: Transaction[]
  currentMonth: number
  currentYear: number
  selectedCategory: CategoryKey | null
  isLoading: boolean
  error: string | null
}

/**
 * Filter options for transaction filtering
 */
export interface TransactionFilter {
  type: TransactionType | 'all'
  category: CategoryKey | 'all'
  startDate: Date | null
  endDate: Date | null
  searchTerm: string
}

/**
 * Chart data point for analytics
 */
export interface ChartDataPoint {
  label: string
  value: number
  color: string
}

/**
 * Category summary for analytics
 */
export interface CategorySummary {
  category: CategoryKey
  name: string
  amount: number
  percentage: number
  color: string
}
