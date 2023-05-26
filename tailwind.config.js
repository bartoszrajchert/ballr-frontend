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
        white: '#ffffff',
        black: '#0e0f0c',
        red: '#d73a49',
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
        'heading-h1': [
          '40px',
          { fontWeight: 'bold', lineHeight: '135%', letterSpacing: '0.02em' },
        ],
        'heading-h2': [
          '32px',
          { fontWeight: 'bold', lineHeight: '135%', letterSpacing: '0.02em' },
        ],
        'heading-h3': [
          '28px',
          { fontWeight: 'bold', lineHeight: '135%', letterSpacing: '0.02em' },
        ],
        'heading-h4': ['24px', { fontWeight: 'bold' }],
        'heading-h5': ['20px', { fontWeight: 'bold' }],
        'heading-title-desktop': [
          '56px',
          { lineHeight: '56px', fontWeight: '900', letterSpacing: '-0.07em' },
        ],
        'heading-title-mobile': ['48px', { lineHeight: '40px' }],
        'p-large': ['18px', { lineHeight: '140%' }],
        'p-medium': ['16px', { lineHeight: '140%' }],
        base: ['16px', { lineHeight: '140%' }],
        'p-small': ['14px', { lineHeight: '140%' }],
        'p-xsmall': ['12px', { lineHeight: '140%' }],
        'label-large': ['18px', { lineHeight: '140%', fontWeight: 'bold' }],
        'label-medium': ['16px', { lineHeight: '140%', fontWeight: 'bold' }],
        'label-small': ['14px', { lineHeight: '140%', fontWeight: 'bold' }],
        'label-xsmall': ['12px', { lineHeight: '140%', fontWeight: 'bold' }],
      },
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        full: '9999px',
      },
      aspectRatio: {
        '9/16': '9 / 16',
      },
      boxShadow: {
        'border-1px': 'inset 0 0 0 1px',
        'border-2px': 'inset 0 0 0 2px',
        'border-3px': 'inset 0 0 0 3px',
      },
      keyframes: {
        // Navigation menu
        'enter-from-right': {
          '0%': { transform: 'translateX(200px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'enter-from-left': {
          '0%': { transform: 'translateX(-200px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'exit-to-right': {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(200px)', opacity: 0 },
        },
        'exit-to-left': {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(-200px)', opacity: 0 },
        },
        'scale-in-content': {
          '0%': { transform: 'rotateX(-30deg) scale(0.9)', opacity: 0 },
          '100%': { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
        },
        'scale-out-content': {
          '0%': { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
          '100%': { transform: 'rotateX(-10deg) scale(0.95)', opacity: 0 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-out': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
    },
    animation: {
      // Navigation menu
      'enter-from-right': 'enter-from-right 0.25s ease',
      'enter-from-left': 'enter-from-left 0.25s ease',
      'exit-to-right': 'exit-to-right 0.25s ease',
      'exit-to-left': 'exit-to-left 0.25s ease',
      'scale-in-content': 'scale-in-content 0.2s ease',
      'scale-out-content': 'scale-out-content 0.2s ease',
      'fade-in': 'fade-in 0.2s ease',
      'fade-out': 'fade-out 0.2s ease',
    },
  },
  plugins: [require('tailwindcss-radix')()],
};
