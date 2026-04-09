/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:     '#06060E',
          purple: '#7B2FFF',
          blue:   '#1A1AFF',
          muted:  'rgba(255,255,255,0.4)',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        mono:    ['"DM Mono"',          'monospace'],
        body:    ['"DM Sans"',          'sans-serif'],
      },
    },
  },
  plugins: [],
}
