/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          100: '#ebffcc',
          200: '#d6fb9e',
          300: '#c1f376',
          400: '#a8e44c',
          500: '#85c831',
          600: '#62a81c',
          700: '#4b8610',
          800: '#306407',
          900: '#133300',
        },
        core: {
          white: '#ffffff',
          black: '#0e0f0c',
          red: '#d73a49',
        },
        grey: {
          100: '#f9fafa',
          200: '#eceeee',
          300: '#d0d5d6',
          400: '#b6bdbe',
          500: '#9ca6a7',
          600: '#838d8d',
          700: '#5a6060',
          800: '#474c4c',
          900: '#383c3c',
        },
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        satoshi: 'Satoshi',
      },
      borderRadius: {
        none: '0',
        xs: '0.25rem',
        sm: '0.3125rem',
        default: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
