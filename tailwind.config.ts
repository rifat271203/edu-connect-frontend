import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/app.vue',
    './src/pages/**/*.vue',
    './src/components/**/*.{vue,js,ts,jsx,tsx}',
    './src/layouts/**/*.vue'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: '#07090f',
        'ink-2': '#0c1120',
        'surface-base': '#141c2e',
        'surface-2': '#1a2438',
        'surface-3': '#1f2d45',
        gold: '#c4a464',
        'gold-2': '#e8c882',
        line: 'rgba(255,255,255,0.06)',
        'line-2': 'rgba(255,255,255,0.10)',
        'line-gold': 'rgba(196,164,100,0.28)',
        'text-1': '#f4f1eb',
        'text-2': 'rgba(244,241,235,0.58)',
        'text-3': 'rgba(244,241,235,0.28)',
        // Custom Color Theme
        theme: {
          gray: '#9C9A9A',
          terracotta: '#A35E47',
          black: '#000000',
          darkgray: '#464646'
        },
        // Dark theme palette
        dark: {
          50: 'rgb(var(--color-dark-50) / <alpha-value>)',
          100: 'rgb(var(--color-dark-100) / <alpha-value>)',
          200: 'rgb(var(--color-dark-200) / <alpha-value>)',
          300: 'rgb(var(--color-dark-300) / <alpha-value>)',
          400: 'rgb(var(--color-dark-400) / <alpha-value>)',
          500: 'rgb(var(--color-dark-500) / <alpha-value>)',
          600: 'rgb(var(--color-dark-600) / <alpha-value>)',
          700: 'rgb(var(--color-dark-700) / <alpha-value>)',
          800: 'rgb(var(--color-dark-800) / <alpha-value>)',
          900: 'rgb(var(--color-dark-900) / <alpha-value>)',
          950: 'rgb(var(--color-dark-950) / <alpha-value>)'
        },
        // Accent colors - mode-aware (green in light mode, terracotta in dark mode)
        accent: {
          DEFAULT: 'rgb(var(--color-accent-500) / <alpha-value>)',
          light: 'rgb(var(--color-accent-400) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-600) / <alpha-value>)',
          50: 'rgb(var(--color-accent-50) / <alpha-value>)',
          100: 'rgb(var(--color-accent-100) / <alpha-value>)',
          200: 'rgb(var(--color-accent-200) / <alpha-value>)',
          300: 'rgb(var(--color-accent-300) / <alpha-value>)',
          400: 'rgb(var(--color-accent-400) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          600: 'rgb(var(--color-accent-600) / <alpha-value>)',
          700: 'rgb(var(--color-accent-700) / <alpha-value>)',
          800: 'rgb(var(--color-accent-800) / <alpha-value>)',
          900: 'rgb(var(--color-accent-900) / <alpha-value>)'
        },
        // Primary Green - Eye-catching vibrant green
        green: {
          DEFAULT: '#10b981',
          light: '#6ee7b7',
          lighter: '#a7f3d0',
          dark: '#059669',
          darker: '#047857',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231'
        },
        // Secondary accent - Golden/Orange
        secondary: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        // Purple accent for gradients
        purple: {
          400: '#a78bfa',
          500: '#a855f7',
          600: '#9333ea'
        },
        // Surface colors for glassmorphism
        surface: {
          glass: 'var(--surface-glass)',
          'glass-light': 'var(--surface-glass-light)',
          'glass-border': 'var(--surface-glass-border)',
          'glass-hover': 'var(--surface-glass-hover)',
          'glass-accent': 'var(--surface-glass-accent)',
          'glass-gradient': 'var(--surface-glass-gradient)'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Instrument Serif', 'ui-serif', 'Georgia', 'serif'],
        mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      boxShadow: {
        // Glow effects - Terracotta
         'glow': '0 0 20px rgb(var(--color-accent-500) / 0.3)',
         'glow-sm': '0 0 10px rgb(var(--color-accent-500) / 0.2)',
         'glow-lg': '0 0 40px rgb(var(--color-accent-500) / 0.4)',
         'glow-accent': '0 0 20px rgb(var(--color-accent-500) / 0.5)',
        // Glow effects - Terracotta dark
        'glow-terracotta': '0 0 20px rgba(139, 77, 57, 0.4)',
        'glow-terracotta-sm': '0 0 10px rgba(139, 77, 57, 0.25)',
        'glow-terracotta-lg': '0 0 50px rgba(139, 77, 57, 0.5)',
        // Multi-color glow
         'glow-gradient': '0 0 30px rgb(var(--color-accent-500) / 0.3), 0 0 60px rgb(var(--color-accent-500) / 0.2)',
        // Card shadows
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
         'card-accent': '0 8px 32px rgb(var(--color-accent-500) / 0.15)',
        // Inner glow
         'inner-glow': 'inset 0 0 20px rgb(var(--color-accent-500) / 0.1)',
         'inner-glow-terracotta': 'inset 0 0 20px rgb(var(--color-accent-500) / 0.1)',
         'inner-glow-gradient': 'inset 0 0 30px rgb(var(--color-accent-500) / 0.08), inset 0 0 60px rgb(var(--color-accent-500) / 0.05)'
      },
      backdropBlur: {
        'xs': '2px'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-glow-accent': 'pulse-glow-terracotta 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'shimmer-accent': 'shimmer-terracotta 3s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'gradient-shift': 'gradient-shift 4s ease-in-out infinite'
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' }
        },
        'pulse-glow-terracotta': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(163, 94, 71, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(163, 94, 71, 0.6)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'shimmer-terracotta': {
          '0%': { backgroundPosition: '-1000% 0' },
          '100%': { backgroundPosition: '1000% 0' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)'
      },
      transitionDuration: {
        '400': '400ms'
      }
    }
  },
  plugins: []
}
