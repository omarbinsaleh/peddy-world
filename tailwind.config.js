/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{html,js}"],
   theme: {
     extend: {
      fontFamily: {
         "lato" : ['Lato', 'sans-serif']
      },
      colors : {
         "primary" : "#0E7A81",
      }
     },
   },
   plugins: [],
 }