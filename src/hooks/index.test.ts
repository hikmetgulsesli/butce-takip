/**
 * Tests for useLocalStorage and useTransactions hooks
 * US-003: LocalStorage Hook & Transaction Hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { useLocalStorage, useTransactions } from './index'

// Store original localStorage
const originalLocalStorage = window.localStorage

describe('useLocalStorage', () => {
  let storage: Record<string, string> = {}

  beforeEach(() => {
    storage = {}
    // Create fresh localStorage mock for each test
    const localStorageMock: Storage = {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { storage[key] = value }),
      removeItem: vi.fn((key: string) => { delete storage[key] }),
      clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]) }),
      key: vi.fn((index: number) => Object.keys(storage)[index] ?? null),
      get length() { return Object.keys(storage).length },
    } as unknown as Storage

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    cleanup()
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    })
    vi.restoreAllMocks()
  })

  it('should initialize with initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    const [value] = result.current
    expect(value).toBe('initial')
  })

  it('should read existing value from localStorage', () => {
    storage['test-key'] = JSON.stringify('stored-value')
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    const [value] = result.current
    expect(value).toBe('stored-value')
  })

  it('should update value and persist to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    const [, setValue] = result.current

    act(() => {
      setValue('new-value')
    })

    const [value] = result.current
    expect(value).toBe('new-value')
    expect(storage['test-key']).toBe(JSON.stringify('new-value'))
  })

  it('should accept a function updater like useState', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 10))
    const [, setValue] = result.current

    act(() => {
      setValue(prev => prev + 5)
    })

    const [value] = result.current
    expect(value).toBe(15)
  })

  it('should handle complex objects', () => {
    const initialObj = { count: 0, items: [] }
    const { result } = renderHook(() => useLocalStorage('obj-key', initialObj))
    const [, setValue] = result.current

    act(() => {
      setValue({ count: 5, items: ['a', 'b'] })
    })

    const [value] = result.current
    expect(value).toEqual({ count: 5, items: ['a', 'b'] })
    expect(storage['obj-key']).toBe(JSON.stringify({ count: 5, items: ['a', 'b'] }))
  })

  it('should handle localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Override getItem to throw an error
    Object.defineProperty(window, 'localStorage', {
      value: {
        ...window.localStorage,
        getItem: vi.fn(() => { throw new Error('Storage error') }),
      },
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useLocalStorage('error-key', 'fallback'))
    const [value] = result.current

    expect(value).toBe('fallback')
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should handle different storage keys independently', () => {
    storage['key-1'] = JSON.stringify('value-1')
    storage['key-2'] = JSON.stringify('value-2')

    const { result: result1 } = renderHook(() => useLocalStorage('key-1', 'default-1'))
    const { result: result2 } = renderHook(() => useLocalStorage('key-2', 'default-2'))

    expect(result1.current[0]).toBe('value-1')
    expect(result2.current[0]).toBe('value-2')
  })
})

describe('useTransactions', () => {
  let storage: Record<string, string> = {}

  beforeEach(() => {
    storage = {}
    const localStorageMock: Storage = {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { storage[key] = value }),
      removeItem: vi.fn((key: string) => { delete storage[key] }),
      clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]) }),
      key: vi.fn((index: number) => Object.keys(storage)[index] ?? null),
      get length() { return Object.keys(storage).length },
    } as unknown as Storage

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    cleanup()
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    })
    vi.restoreAllMocks()
  })

  const createMockTransaction = (overrides = {}) => ({
    type: 'expense' as const,
    amount: 100,
    category: 'yemek' as const,
    description: 'Test transaction',
    date: new Date('2024-03-15'),
    ...overrides,
  })

  it('should initialize with empty transactions array', () => {
    const { result } = renderHook(() => useTransactions())
    expect(result.current.transactions).toEqual([])
  })

  it('should add a transaction with auto-generated ID', () => {
    const { result } = renderHook(() => useTransactions())
    const { addTransaction } = result.current

    act(() => {
      addTransaction(createMockTransaction())
    })

    expect(result.current.transactions).toHaveLength(1)
    expect(result.current.transactions[0].id).toBeDefined()
    expect(result.current.transactions[0].amount).toBe(100)
    expect(result.current.transactions[0].description).toBe('Test transaction')
  })

  it('should persist transactions to localStorage', () => {
    const { result } = renderHook(() => useTransactions())

    act(() => {
      result.current.addTransaction(createMockTransaction({ amount: 250 }))
    })

    const stored = JSON.parse(storage['butce-takip-transactions'])
    expect(stored).toHaveLength(1)
    expect(stored[0].amount).toBe(250)
  })

  it('should load existing transactions from localStorage', () => {
    const existingTransaction = {
      id: 'existing-id',
      type: 'income',
      amount: 5000,
      category: 'maas',
      description: 'Maaş ödemesi',
      date: '2024-03-01T00:00:00.000Z',
    }
    storage['butce-takip-transactions'] = JSON.stringify([existingTransaction])

    const { result } = renderHook(() => useTransactions())
    expect(result.current.transactions).toHaveLength(1)
    expect(result.current.transactions[0].id).toBe('existing-id')
    expect(result.current.transactions[0].amount).toBe(5000)
  })

  it('should delete a transaction by ID', () => {
    const { result } = renderHook(() => useTransactions())

    act(() => {
      result.current.addTransaction(createMockTransaction())
    })

    const idToDelete = result.current.transactions[0].id

    act(() => {
      result.current.deleteTransaction(idToDelete)
    })

    expect(result.current.transactions).toHaveLength(0)
  })

  it('should filter transactions by month and year', () => {
    const { result } = renderHook(() => useTransactions())

    act(() => {
      // March 2024 transaction
      result.current.addTransaction(createMockTransaction({ 
        date: new Date('2024-03-15'),
        amount: 100 
      }))
      // February 2024 transaction
      result.current.addTransaction(createMockTransaction({ 
        date: new Date('2024-02-10'),
        amount: 200 
      }))
      // March 2023 transaction
      result.current.addTransaction(createMockTransaction({ 
        date: new Date('2023-03-20'),
        amount: 300 
      }))
    })

    const march2024 = result.current.getTransactionsByMonth(2024, 2) // March is month 2 (0-indexed)
    expect(march2024).toHaveLength(1)
    expect(march2024[0].amount).toBe(100)

    const feb2024 = result.current.getTransactionsByMonth(2024, 1)
    expect(feb2024).toHaveLength(1)
    expect(feb2024[0].amount).toBe(200)

    const march2023 = result.current.getTransactionsByMonth(2023, 2)
    expect(march2023).toHaveLength(1)
    expect(march2023[0].amount).toBe(300)
  })

  it('should calculate income total for a month', () => {
    const { result } = renderHook(() => useTransactions())

    act(() => {
      result.current.addTransaction(createMockTransaction({ 
        type: 'income',
        amount: 5000,
        date: new Date('2024-03-01'),
        category: 'maas'
      }))
      result.current.addTransaction(createMockTransaction({ 
        type: 'income',
        amount: 1000,
        date: new Date('2024-03-15'),
        category: 'firsat'
      }))
      result.current.addTransaction(createMockTransaction({ 
        type: 'expense',
        amount: 200,
        date: new Date('2024-03-10'),
      }))
      // February income (should not be counted)
      result.current.addTransaction(createMockTransaction({ 
        type: 'income',
        amount: 3000,
        date: new Date('2024-02-01'),
        category: 'maas'
      }))
    })

    const incomeTotal = result.current.getIncomeTotal(2024, 2) // March 2024
    expect(incomeTotal).toBe(6000)
  })

  it('should calculate expense total for a month', () => {
    const { result } = renderHook(() => useTransactions())

    act(() => {
      result.current.addTransaction(createMockTransaction({ 
        type: 'expense',
        amount: 150,
        date: new Date('2024-03-05'),
      }))
      result.current.addTransaction(createMockTransaction({ 
        type: 'expense',
        amount: 250,
        date: new Date('2024-03-10'),
      }))
      result.current.addTransaction(createMockTransaction({ 
        type: 'income',
        amount: 5000,
        date: new Date('2024-03-01'),
        category: 'maas'
      }))
      // February expense (should not be counted)
      result.current.addTransaction(createMockTransaction({ 
        type: 'expense',
        amount: 100,
        date: new Date('2024-02-01'),
      }))
    })

    const expenseTotal = result.current.getExpenseTotal(2024, 2) // March 2024
    expect(expenseTotal).toBe(400)
  })

  it('should calculate balance (income - expense) for a month', () => {
    const { result } = renderHook(() => useTransactions())

    act(() => {
      result.current.addTransaction(createMockTransaction({ 
        type: 'income',
        amount: 5000,
        date: new Date('2024-03-01'),
        category: 'maas'
      }))
      result.current.addTransaction(createMockTransaction({ 
        type: 'expense',
        amount: 1500,
        date: new Date('2024-03-05'),
      }))
      result.current.addTransaction(createMockTransaction({ 
        type: 'expense',
        amount: 800,
        date: new Date('2024-03-10'),
      }))
    })

    const balance = result.current.getBalance(2024, 2) // March 2024
    expect(balance).toBe(2700) // 5000 - 1500 - 800
  })

  it('should handle multiple transactions with CRUD operations', () => {
    const { result } = renderHook(() => useTransactions())

    // Add multiple transactions
    act(() => {
      result.current.addTransaction(createMockTransaction({ 
        amount: 100,
        date: new Date('2024-03-01'),
      }))
      result.current.addTransaction(createMockTransaction({ 
        amount: 200,
        date: new Date('2024-03-02'),
      }))
      result.current.addTransaction(createMockTransaction({ 
        amount: 300,
        date: new Date('2024-03-03'),
      }))
    })

    expect(result.current.transactions).toHaveLength(3)

    // Delete middle transaction
    const idToDelete = result.current.transactions[1].id
    act(() => {
      result.current.deleteTransaction(idToDelete)
    })

    expect(result.current.transactions).toHaveLength(2)
    expect(result.current.transactions[0].amount).toBe(100)
    expect(result.current.transactions[1].amount).toBe(300)

    // Verify localStorage was updated
    const stored = JSON.parse(storage['butce-takip-transactions'])
    expect(stored).toHaveLength(2)
  })

  it('should handle income and expense types correctly', () => {
    const { result } = renderHook(() => useTransactions())

    act(() => {
      result.current.addTransaction(createMockTransaction({ 
        type: 'income',
        amount: 10000,
        category: 'maas',
        date: new Date('2024-03-01'),
      }))
      result.current.addTransaction(createMockTransaction({ 
        type: 'expense',
        amount: 3000,
        category: 'yemek',
        date: new Date('2024-03-05'),
      }))
    })

    expect(result.current.transactions[0].type).toBe('income')
    expect(result.current.transactions[1].type).toBe('expense')
    expect(result.current.getIncomeTotal(2024, 2)).toBe(10000)
    expect(result.current.getExpenseTotal(2024, 2)).toBe(3000)
  })
})
