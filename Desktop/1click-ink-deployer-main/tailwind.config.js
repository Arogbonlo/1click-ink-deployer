/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  
  theme: {
    extend: {
      colors: {
        polkadot: {
          DEFAULT: '#e6007a',     
          light: '#ff4da6',       
          dark: '#b8005f',        
          softer: '#ffd6eb',      
        },
      },
    },
  },
  plugins: [],
};
