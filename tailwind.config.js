/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface-dark': '#0f172a',
        'surface': '#1e293b',
        'primary': '#3b82f6',
        'income': '#22c55e',
        'expense': '#ef4444',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
