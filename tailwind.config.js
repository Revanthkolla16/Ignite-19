export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'shadow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 16px 2px rgba(220,220,255,0.7)' },
          '50%': { 'box-shadow': '0 0 32px 12px rgba(220,220,255,1)' },
        },
        'shadow-pulse-gold': {
          '0%, 100%': { 'box-shadow': '0 0 16px 2px rgba(255,215,0,0.5)' },
          '50%': { 'box-shadow': '0 0 20px 6px rgba(255,215,0,0.9)' },
        },
      },
      animation: {
        'shadow-pulse': 'shadow-pulse 1.5s ease-in-out infinite',
        'shadow-pulse-gold': 'shadow-pulse-gold 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}; 