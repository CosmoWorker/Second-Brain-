/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray:{
          100:"#FFFFFF",
          200: "#F9FBFC",
          600: "#70767C"
        },
        purple:{
          200: "#DEE8FE",
          500:"#4741AB",
          600: "#5046E4"
        }
      }
    },
  },
  plugins: [],
}

