/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: { DEFAULT: '#07111C', 800: '#0B1826', 700: '#102233', 600: '#18304A' },
        ivory: '#F7F1E7',
        sand: '#D9B98D',
        gold: '#D6A96B',
        teal: '#35D6C3',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Amiri"', 'serif'],
        sans: ['"Inter Variable"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        arabicDisplay: ['"Amiri"', 'serif'],
      },
    },
  },
  plugins: [],
};
