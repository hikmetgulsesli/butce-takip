/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // US-002: Design Tokens - Dark theme backgrounds
        'surface-dark': '#0f172a',     // slate-900
        'surface': '#1e293b',          // slate-800
        'card-dark': '#1e293b',        // slate-800
        
        // US-002: Design Tokens - Primary accent (blue-500)
        'primary': '#3b82f6',          // blue-500
        'primary-light': '#60a5fa',    // blue-400
        'primary-dark': '#2563eb',     // blue-600
        
        // US-002: Design Tokens - Income color (green-500)
        'income': '#22c55e',           // green-500
        'income-light': '#4ade80',     // green-400
        'income-dark': '#16a34a',      // green-600
        
        // US-002: Design Tokens - Expense color (red-500)
        'expense': '#ef4444',          // red-500
        'expense-light': '#f87171',    // red-400
        'expense-dark': '#dc2626',     // red-600
        
        // US-002: Design Tokens - Border colors
        'border-muted': '#334155',     // slate-700
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
      // US-002: Design Tokens - Custom animation for UI
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
