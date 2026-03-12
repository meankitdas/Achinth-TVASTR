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
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in-up': 'fadeInUp 0.7s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', boxShadow: '0 0 20px rgba(245,158,11,0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 40px rgba(245,158,11,0.6)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'forge-gradient': 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)',
        'grid-pattern': 'linear-gradient(rgba(168,168,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,168,180,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
}
