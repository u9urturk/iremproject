/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandWhite: '#f9faf5',
        brandBlue: '#7b83e6',
        brandGray: '#b7bac3'
      }
    }
  },
  plugins: [],
}

