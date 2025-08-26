/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-dark': '#1f2937',
        'content-light': '#f9fafb',
        'primary-yellow': '#f97316',
        'spot-occupied': '#1e40af',
        'spot-available': '#e5e7eb',
        'spot-selected': '#f97316',
      }
    },
  },
  plugins: [],
}
