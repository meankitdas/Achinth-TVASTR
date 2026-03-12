/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0a0a0b',
          900: '#111113',
          800: '#1a1a1e',
          700: '#222228',
          600: '#2d2d35',
        },
        metallic: {
          100: '#e8e8ec',
          200: '#c8c8d0',
          300: '#a8a8b4',
          400: '#888896',
          500: '#686878',
          600: '#484858',
        },
        amber: {
          forge: '#f59e0b',
          glow: '#fbbf24',
          dim: '#d97706',
          ember: '#b45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
