/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FB5FB0',   // Vibrant pink for headers/buttons
        secondary: '#0C0C0C', // Black for text
        background: '#F6F6F6', // Soft gray for bg
        accent: '#FF4D67',    // Bold red for active states
        accent2: '#FFA5B2',   // Light pink for subtle highlights
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'], // Custom font
      },
    },
  },
  plugins: [],
};