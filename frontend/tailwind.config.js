/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4f46e5',
        'secondary': '#10b981',
        'background': '#f1f5f9',
        'surface': '#ffffff',
        'on-surface': '#1e293b',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'danger': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}