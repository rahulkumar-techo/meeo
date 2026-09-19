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
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#DBEAFE',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          light: '#EDE9FE',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
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
          DEFAULT: '#0284C7',
          light: '#E0F2FE',
        },
        background: {
          DEFAULT: '#F8FAFC',
          dark: '#0B0F17',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#161F30',
          elevated: '#FFFFFF',
          'elevated-dark': '#1E293B',
          subtle: '#F1F5F9',
          'subtle-dark': '#111827',
        },
        'text-primary': {
          DEFAULT: '#0F172A',
          dark: '#F8FAFC',
        },
        'text-secondary': {
          DEFAULT: '#64748B',
          dark: '#94A3B8',
        },
        'text-muted': {
          DEFAULT: '#94A3B8',
          dark: '#64748B',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#1E293B',
        },
        disabled: {
          DEFAULT: '#CBD5E1',
          dark: '#334155',
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