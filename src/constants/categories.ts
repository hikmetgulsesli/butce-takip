/**
 * Category constants for Budget Tracking Application
 * US-002: Design Tokens, Types & Categories
 * 
 * Income categories: Maaş, Fırsat, Yatırım, Diğer
 * Expense categories: Yemek, Ulaşım, Fatura, Eğlence, Sağlık, Diğer
 */

import type { Category, IncomeCategoryKey, ExpenseCategoryKey } from '../types'

/**
 * Income categories with Turkish names
 */
export const INCOME_CATEGORIES: Record<IncomeCategoryKey, Category> = {
  maas: {
    id: 'maas',
    name: 'Maaş',
    icon: 'wallet',
    color: '#22c55e',
    type: 'income'
  },
  firsat: {
    id: 'firsat',
    name: 'Fırsat',
    icon: 'sparkles',
    color: '#10b981',
    type: 'income'
  },
  yatirim: {
    id: 'yatirim',
    name: 'Yatırım',
    icon: 'trending-up',
    color: '#059669',
    type: 'income'
  },
  'diger-gelir': {
    id: 'diger-gelir',
    name: 'Diğer Gelir',
    icon: 'plus-circle',
    color: '#047857',
    type: 'income'
  }
}

/**
 * Expense categories with Turkish names
 */
export const EXPENSE_CATEGORIES: Record<ExpenseCategoryKey, Category> = {
  yemek: {
    id: 'yemek',
    name: 'Yemek',
    icon: 'utensils',
    color: '#ef4444',
    type: 'expense'
  },
  ulasim: {
    id: 'ulasim',
    name: 'Ulaşım',
    icon: 'car',
    color: '#f97316',
    type: 'expense'
  },
  fatura: {
    id: 'fatura',
    name: 'Fatura',
    icon: 'receipt',
    color: '#eab308',
    type: 'expense'
  },
  eglence: {
    id: 'eglence',
    name: 'Eğlence',
    icon: 'party-popper',
    color: '#a855f7',
    type: 'expense'
  },
  saglik: {
    id: 'saglik',
    name: 'Sağlık',
    icon: 'heart-pulse',
    color: '#ec4899',
    type: 'expense'
  },
  'diger-gider': {
    id: 'diger-gider',
    name: 'Diğer Gider',
    icon: 'more-horizontal',
    color: '#64748b',
    type: 'expense'
  }
}

/**
 * All categories combined
 */
export const ALL_CATEGORIES: Record<string, Category> = {
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES
}

/**
 * Get category by ID
 */
export function getCategory(id: string): Category | undefined {
  return ALL_CATEGORIES[id]
}

/**
 * Get all income categories as array
 */
export function getIncomeCategories(): Category[] {
  return Object.values(INCOME_CATEGORIES)
}

/**
 * Get all expense categories as array
 */
export function getExpenseCategories(): Category[] {
  return Object.values(EXPENSE_CATEGORIES)
}

/**
 * Get all categories as array
 */
export function getAllCategories(): Category[] {
  return Object.values(ALL_CATEGORIES)
}

/**
 * Check if a category key belongs to income
 */
export function isIncomeCategory(id: string): boolean {
  return id in INCOME_CATEGORIES
}

/**
 * Check if a category key belongs to expense
 */
export function isExpenseCategory(id: string): boolean {
  return id in EXPENSE_CATEGORIES
}
