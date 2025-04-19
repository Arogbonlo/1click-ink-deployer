/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 this covers everything in src
  ],  
  theme: {
    extend: {
      colors: {
        polkadot: {
          DEFAULT: '#e6007a',     // main Polkadot pink
          light: '#ff4da6',       // lighter variant
          dark: '#b8005f',        // deeper shade
          softer: '#ffd6eb',      // for backgrounds and subtle accents
        },
      },
    },
  },
  plugins: [],
};
