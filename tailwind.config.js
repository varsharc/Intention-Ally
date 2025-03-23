
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-750': '#2D2D2D',
        'gray-850': '#1A1A1A',
        'gray-900': '#121212',
        'gray-950': '#0A0A0A',
      },
    },
  },
  plugins: [],
}
