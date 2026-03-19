/**
 * Custom React hooks for budget tracking app
 */

import { useState, useCallback } from 'react'

/**
 * Hook for managing local storage state
 */
// eslint-disable-next-line no-unused-vars
export function useLocalStorage<T>(key: string, initialValue: T): [T, (newValue: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  const setValue = useCallback((newValue: T) => {
    try {
      setStoredValue(newValue)
      window.localStorage.setItem(key, JSON.stringify(newValue))
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
    setIsDark(prev => {
      const next = !prev
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
