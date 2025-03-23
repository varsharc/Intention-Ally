
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./attached_assets/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2D2D2D',
          850: '#1A1A1A',
          900: '#111111',
          950: '#0A0A0A'
        },
        yellow: {
          500: '#EAB308',
          600: '#CA8A04'
        }
      },
    },
  },
  plugins: [],
}
