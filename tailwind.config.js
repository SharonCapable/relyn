/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          teal: {
            DEFAULT: '#006a61',
            container: '#008378',
            fixed: '#89f5e7',
          },
          blue: {
            DEFAULT: '#0051d5',
            container: '#316bf3',
          },
          orange: {
            DEFAULT: '#825100', // AI Tertiary
            container: '#a36700',
          },
        },
        surface: {
          DEFAULT: '#f8f9fa',
          low: '#f3f4f5',
          lowest: '#ffffff',
          bright: '#f8f9fa',
        },
        text: {
          primary: '#191c1d',
          secondary: '#3d4947',
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
    },
  },
  plugins: [],
}
