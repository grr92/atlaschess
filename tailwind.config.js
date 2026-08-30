/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atlas: {
          back: '#1E140F',       // App main background color
          grad: '#2A1C15',     // App background fade on top
          surface: '#3E2723',  // Boxes, menus, buttons and pop-up's
          secSurface: '#5D4037', // Secondary buttons color
          hover: '#795548',    // Button hover color
          secHover: '#A1887F', // Secondary hover color
          normalText: '#E6CCB2',     // Normal text color
          titleText: '#FFFFFF',     // Color for titles or special text
          boardDark: '#b58863', // Dark board tile
          boardLight: '#f0d9b5' // Light board tile
        }
      }
    },
  },
  plugins: [],
}