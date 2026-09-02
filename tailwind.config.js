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
          back: '#0b0d11',       // Main dark obsidian background
          grad: '#151923',       // Ambient gradient fade
          surface: '#1a1f2c',    // Dark glass panels and cards
          secSurface: '#242b3d', // Secondary elevated surfaces
          hover: '#2d364d',      // Surface hover color
          secHover: '#38435f',   // Secondary hover color
          gold: '#d4af37',       // Antique gold primary accent
          goldHover: '#e5c05b',  // Antique gold hover
          normalText: '#94a3b8', // Subtle slate text
          titleText: '#f8fafc',  // Crisp white/ivory text
          boardDark: '#b58863',  // Dark board tile
          boardLight: '#f0d9b5'  // Light board tile
        }
      }
    },
  },
  plugins: [],
}