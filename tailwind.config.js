/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Smart City Dialog primary colors
        primary: {
          DEFAULT: '#0070BA', // Smart City Dialog blue
          50: '#E6F4FF',
          100: '#CCE9FF',
          200: '#99D3FF',
          300: '#66BDFF',
          400: '#33A7FF',
          500: '#0070BA',
          600: '#005A95',
          700: '#004370',
          800: '#002D4B',
          900: '#001626',
        },
        // Secondary accent colors from Smart City Dialog
        accent: {
          DEFAULT: '#00A651', // Green accent
          50: '#E6F7ED',
          100: '#CCEFDB',
          200: '#99DFB7',
          300: '#66CF93',
          400: '#33BF6F',
          500: '#00A651',
          600: '#008541',
          700: '#006431',
          800: '#004221',
          900: '#002110',
        },
        // Orange accent from Smart City Dialog
        orange: {
          DEFAULT: '#FF6B35',
          50: '#FFF2ED',
          100: '#FFE5DB',
          200: '#FFCBB7',
          300: '#FFB193',
          400: '#FF976F',
          500: '#FF6B35',
          600: '#CC562A',
          700: '#99401F',
          800: '#662B15',
          900: '#33150A',
        },
        // Updated teal to match Smart City Dialog palette
        teal: {
          DEFAULT: '#00A0B0',
          50: '#E6F7F9',
          100: '#CCEFF3',
          200: '#99DFE7',
          300: '#66CFDB',
          400: '#33BFCF',
          500: '#00A0B0',
          600: '#00808D',
          700: '#00606A',
          800: '#004047',
          900: '#002023',
        },
        // Keep lime as is - it works well with the palette
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
        // Enhanced gray scale for better contrast
        gray: {
          50: '#FAFBFC',
          100: '#F4F6F8',
          200: '#E8ECF0',
          300: '#D1D9E0',
          400: '#9AA5B1',
          500: '#697586',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#0F172A',
        }
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
        'gradient-primary': 'linear-gradient(135deg, #0070BA 0%, #00A651 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00A0B0 0%, #96C11F 100%)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            p: {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
            },
            a: {
              color: 'inherit',
              '&:hover': {
                color: 'inherit',
                opacity: 0.8,
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};