/**
 * Category constants tests
 * US-002: Design Tokens, Types & Categories
 */

import { describe, it, expect } from 'vitest'
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  ALL_CATEGORIES,
  getCategory,
  getIncomeCategories,
  getExpenseCategories,
  getAllCategories,
  isIncomeCategory,
  isExpenseCategory
} from './categories'

describe('categories', () => {
  describe('INCOME_CATEGORIES', () => {
    it('has all required income categories', () => {
      expect(INCOME_CATEGORIES).toHaveProperty('maas')
      expect(INCOME_CATEGORIES).toHaveProperty('firsat')
      expect(INCOME_CATEGORIES).toHaveProperty('yatirim')
      expect(INCOME_CATEGORIES).toHaveProperty('diger-gelir')
    })

    it('each income category has required properties', () => {
      Object.values(INCOME_CATEGORIES).forEach(category => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('icon')
        expect(category).toHaveProperty('color')
        expect(category).toHaveProperty('type', 'income')
      })
    })

    it('has Turkish names for all income categories', () => {
      expect(INCOME_CATEGORIES.maas.name).toBe('Maaş')
      expect(INCOME_CATEGORIES.firsat.name).toBe('Fırsat')
      expect(INCOME_CATEGORIES.yatirim.name).toBe('Yatırım')
      expect(INCOME_CATEGORIES['diger-gelir'].name).toBe('Diğer Gelir')
    })
  })

  describe('EXPENSE_CATEGORIES', () => {
    it('has all required expense categories', () => {
      expect(EXPENSE_CATEGORIES).toHaveProperty('yemek')
      expect(EXPENSE_CATEGORIES).toHaveProperty('ulasim')
      expect(EXPENSE_CATEGORIES).toHaveProperty('fatura')
      expect(EXPENSE_CATEGORIES).toHaveProperty('eglence')
      expect(EXPENSE_CATEGORIES).toHaveProperty('saglik')
      expect(EXPENSE_CATEGORIES).toHaveProperty('diger-gider')
    })

    it('each expense category has required properties', () => {
      Object.values(EXPENSE_CATEGORIES).forEach(category => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('icon')
        expect(category).toHaveProperty('color')
        expect(category).toHaveProperty('type', 'expense')
      })
    })

    it('has Turkish names for all expense categories', () => {
      expect(EXPENSE_CATEGORIES.yemek.name).toBe('Yemek')
      expect(EXPENSE_CATEGORIES.ulasim.name).toBe('Ulaşım')
      expect(EXPENSE_CATEGORIES.fatura.name).toBe('Fatura')
      expect(EXPENSE_CATEGORIES.eglence.name).toBe('Eğlence')
      expect(EXPENSE_CATEGORIES.saglik.name).toBe('Sağlık')
      expect(EXPENSE_CATEGORIES['diger-gider'].name).toBe('Diğer Gider')
    })
  })

  describe('ALL_CATEGORIES', () => {
    it('combines income and expense categories', () => {
      const categoryCount = Object.keys(ALL_CATEGORIES).length
      const incomeCount = Object.keys(INCOME_CATEGORIES).length
      const expenseCount = Object.keys(EXPENSE_CATEGORIES).length
      expect(categoryCount).toBe(incomeCount + expenseCount)
    })
  })

  describe('getCategory', () => {
    it('returns category by id', () => {
      expect(getCategory('maas')).toEqual(INCOME_CATEGORIES.maas)
      expect(getCategory('yemek')).toEqual(EXPENSE_CATEGORIES.yemek)
    })

    it('returns undefined for unknown category', () => {
      expect(getCategory('unknown')).toBeUndefined()
    })
  })

  describe('getIncomeCategories', () => {
    it('returns array of income categories', () => {
      const categories = getIncomeCategories()
      expect(categories).toHaveLength(4)
      categories.forEach(cat => {
        expect(cat.type).toBe('income')
      })
    })
  })

  describe('getExpenseCategories', () => {
    it('returns array of expense categories', () => {
      const categories = getExpenseCategories()
      expect(categories).toHaveLength(6)
      categories.forEach(cat => {
        expect(cat.type).toBe('expense')
      })
    })
  })

  describe('getAllCategories', () => {
    it('returns array of all categories', () => {
      const categories = getAllCategories()
      expect(categories).toHaveLength(10)
    })
  })

  describe('isIncomeCategory', () => {
    it('returns true for income category ids', () => {
      expect(isIncomeCategory('maas')).toBe(true)
      expect(isIncomeCategory('yatirim')).toBe(true)
    })

    it('returns false for expense category ids', () => {
      expect(isIncomeCategory('yemek')).toBe(false)
      expect(isIncomeCategory('fatura')).toBe(false)
    })
  })

  describe('isExpenseCategory', () => {
    it('returns true for expense category ids', () => {
      expect(isExpenseCategory('yemek')).toBe(true)
      expect(isExpenseCategory('saglik')).toBe(true)
    })

    it('returns false for income category ids', () => {
      expect(isExpenseCategory('maas')).toBe(false)
      expect(isExpenseCategory('firsat')).toBe(false)
    })
  })
})
