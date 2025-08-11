//#FF6B00
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FF6B00',
        'secondary': '#22D58A',
        'background': '#FDFBF7',
        'surface': '#FFFFFF',
        'on-surface': '#1F1F39',
        'on-surface-secondary': '#69697B',
        'border-color': '#EFF0F6',

        // // These now point to our CSS variables
        // primary: 'rgb(var(--color-primary) / <alpha-value>)',
        // secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        // background: 'rgb(var(--color-background) / <alpha-value>)',
        // surface: 'rgb(var(--color-surface) / <alpha-value>)',
        // 'on-surface': 'rgb(var(--color-on-surface) / <alpha-value>)',
        // 'on-surface-secondary': 'rgb(var(--color-on-surface-secondary) / <alpha-value>)',
        // 'border-color': 'rgb(var(--color-border-color) / <alpha-value>)',
        // danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // THIS ENTIRE SECTION IS NEW OR UPDATED
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(2%)' },
        },
        // More complex animation combining float, rotate, and scale
        'float-complex-1': {
          '0%, 100%': { transform: 'translateY(-3%) rotate(-2deg) scale(1.01)' },
          '50%': { transform: 'translateY(3%) rotate(2deg) scale(1)' },
        },
        'float-complex-2': {
          '0%, 100%': { transform: 'translateY(2%) rotate(3deg) scale(1)' },
          '50%': { transform: 'translateY(-2%) rotate(-3deg) scale(1.02)' },
        },
        'float-complex-3': {
          '0%, 100%': { transform: 'translateY(-4%) rotate(-1deg) scale(1)' },
          '50%': { transform: 'translateY(4%) rotate(1deg) scale(1.01)' },
        },
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        // New utilities for the complex animations
        'float-complex-1': 'float-complex-1 10s ease-in-out infinite',
        'float-complex-2': 'float-complex-2 8s ease-in-out infinite',
        'float-complex-3': 'float-complex-3 12s ease-in-out infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}