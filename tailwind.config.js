/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005C95',
          50: '#E6F3FA',
          100: '#CCE7F5',
          200: '#99CFEB',
          300: '#66B7E0',
          400: '#339FD6',
          500: '#005C95',
          600: '#004A77',
          700: '#003759',
          800: '#00253C',
          900: '#00121E',
        },
        teal: {
          DEFAULT: '#3B8B96',
          50: '#EAF3F4',
          100: '#D5E8E9',
          200: '#ABD0D3',
          300: '#82B9BE',
          400: '#58A1A8',
          500: '#3B8B96',
          600: '#2F6F78',
          700: '#23535A',
          800: '#17373C',
          900: '#0C1B1E',
        },
        lime: {
          DEFAULT: '#96C11F',
          50: '#F4F9E6',
          100: '#E9F2CC',
          200: '#D3E599',
          300: '#BED866',
          400: '#A8CC33',
          500: '#96C11F',
          600: '#779A19',
          700: '#597413',
          800: '#3C4D0C',
          900: '#1E2706',
        },
      },
      fontFamily: {
        sans: [
          'BundesSans Web',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B8B96 0%, #96C11F 100%)',
      },
    },
  },
  plugins: [],
};