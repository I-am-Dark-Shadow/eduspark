/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New Color Palette
        'primary': '#FF6B00', // Vibrant Orange
        'secondary': '#00C49F', // Teal Green
        'background': '#F7F8FC', // Light Grey Background
        'surface': '#FFFFFF', // White for cards
        'on-surface': '#4A4A68', // Dark text color
        'on-surface-secondary': '#A0A0B8', // Lighter text color
        'border-color': '#EFF0F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}