import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatDateShort, generateId, getMonthName } from '../utils'

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats number as Turkish Lira', () => {
      expect(formatCurrency(100)).toBe('₺100,00')
      expect(formatCurrency(1000.5)).toBe('₺1.000,50')
    })
  })

  describe('formatDate', () => {
    it('formats date to Turkish locale', () => {
      const date = new Date('2024-03-15')
      expect(formatDate(date)).toContain('2024')
    })
  })

  describe('formatDateShort', () => {
    it('formats date to DD.MM.YYYY format', () => {
      const date = new Date('2024-03-15')
      expect(formatDateShort(date)).toBe('15.03.2024')
    })
  })

  describe('generateId', () => {
    it('generates unique string id', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).toBeTypeOf('string')
      expect(id1).not.toBe(id2)
    })
  })

  describe('getMonthName', () => {
    it('returns Turkish month name', () => {
      expect(getMonthName(1)).toBe('Ocak')
      expect(getMonthName(3)).toBe('Mart')
      expect(getMonthName(12)).toBe('Aralık')
    })
  })
})
