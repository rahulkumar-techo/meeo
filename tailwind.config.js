/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './App.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D2621',
          dark: '#1A1614',
          light: '#F5EBE6',
        },
        secondary: {
          DEFAULT: '#8C5338',
          dark: '#6E3F29',
          light: '#F9EFEA',
        },
        accent: {
          DEFAULT: '#C27838',
          dark: '#9E5E26',
          light: '#FDF3E7',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#8C5338',
          light: '#F9EFEA',
        },
        background: {
          DEFAULT: '#FAF8F5',
          dark: '#120F0D',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1C1714',
          elevated: '#FFFFFF',
          'elevated-dark': '#28221E',
          subtle: '#F3EFEA',
          'subtle-dark': '#181411',
        },
        'text-primary': {
          DEFAULT: '#2D2621',
          dark: '#FAF8F5',
        },
        'text-secondary': {
          DEFAULT: '#786C64',
          dark: '#A89F97',
        },
        'text-muted': {
          DEFAULT: '#A89F97',
          dark: '#786C64',
        },
        border: {
          DEFAULT: '#E8E2DA',
          dark: '#2E2620',
        },
        disabled: {
          DEFAULT: '#D5CDC4',
          dark: '#3D352F',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        card: '16px',
        pill: '9999px',
      },
      fontSize: {
        display: ['32px', { lineHeight: '40px', fontWeight: '700' }],
        h1: ['28px', { lineHeight: '36px', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '32px', fontWeight: '700' }],
        h3: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        body: ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        btn: ['14px', { lineHeight: '20px', fontWeight: '600' }],
        caption: ['11px', { lineHeight: '14px', fontWeight: '500' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
    },
  },
  plugins: [],
};