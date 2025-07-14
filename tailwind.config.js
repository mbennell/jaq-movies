/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'cinema-black': 'var(--cinema-black)',
        'cinema-dark': 'var(--cinema-dark)',
        'cinema-burgundy': 'var(--cinema-burgundy)',
        'cinema-gold': 'var(--cinema-gold)',
        'cinema-blue': 'var(--cinema-blue)',
        'cinema-purple': 'var(--cinema-purple)',
        'cinema-silver': 'var(--cinema-silver)',
      },
      fontFamily: {
        'heading': 'var(--font-heading)',
        'body': 'var(--font-body)',
        'mono': 'var(--font-mono)',
      },
      borderRadius: {
        'glass': 'var(--border-radius-glass)',
        'card': 'var(--border-radius-card)',
      },
      animation: {
        'film-strip': 'filmStrip 2s linear infinite',
        'cinema-glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      backdropBlur: {
        'glass': '20px',
      }
    },
  },
  plugins: [],
}