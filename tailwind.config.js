import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        career: {
          'color-scheme': 'light',
          primary: '#004ac6',
          'primary-content': '#ffffff',
          secondary: '#86f2e4',
          'secondary-content': '#083a33',
          accent: '#89f5e7',
          'accent-content': '#083d35',
          neutral: '#dee9fc',
          'neutral-content': '#2a3c66',
          'base-100': '#f8f9ff',
          'base-200': '#eff4ff',
          'base-300': '#d9e3f6',
          'base-content': '#121c2a',
          info: '#2563eb',
          success: '#178a68',
          warning: '#b4791e',
          error: '#c84545',
          '--radius-box': '0.75rem',
          '--radius-btn': '0.375rem',
          '--radius-badge': '999px',
        },
      },
    ],
  },
}
