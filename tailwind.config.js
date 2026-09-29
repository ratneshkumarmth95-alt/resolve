/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#07090F',
        card: '#0D111D',
        'card-hover': '#131929',
        border: 'rgba(255, 255, 255, 0.1)',
        murmur: {
          cyan: '#22D3EE',
          amber: '#F59E0B',
          red: '#F43F5E',
          emerald: '#10B981',
          bg: '#07090F',
          card: '#0D111D',
          panel: '#111625',
          text: '#F3F4F6',
          muted: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'pulse-glow-amber': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)' },
        },
        'pulse-glow-red': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(244, 63, 94, 0.3)' },
          '50%': { boxShadow: '0 0 35px rgba(244, 63, 94, 0.7)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      },
      animation: {
        'glow-amber': 'pulse-glow-amber 2s infinite ease-in-out',
        'glow-red': 'pulse-glow-red 1s infinite ease-in-out',
        'pulse-slow': 'pulse-slow 3s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
