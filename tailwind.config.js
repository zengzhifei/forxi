/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          pink: '#ff00ff',
          blue: '#00ffff',
          yellow: '#ffff00',
          dark: '#0d0d0d',
          card: '#1a1a1a',
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 255, 255, 0.5)',
        'glow-pink': '0 0 15px rgba(255, 0, 255, 0.5)',
      },
    },
  },
  plugins: [],
}
