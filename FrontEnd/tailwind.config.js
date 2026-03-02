/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        debata: ['Debata', 'serif'], // custom name: actual font
      },
    },
  },
  plugins: [],
}
