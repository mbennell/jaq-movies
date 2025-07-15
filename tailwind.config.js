const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'film-strip': 'filmStrip 2s linear infinite',
        'cinema-glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0a0a0f",
            foreground: "#ffffff",
            primary: {
              50: "#fefbf0",
              100: "#fdf5dc",
              200: "#fbeab3",
              300: "#f7dd85",
              400: "#f1cb55",
              500: "#d4af37",
              600: "#b8942c",
              700: "#987823",
              800: "#795e1c",
              900: "#614b17",
              DEFAULT: "#d4af37",
              foreground: "#000000",
            },
            secondary: {
              50: "#f9f0f3",
              100: "#f2e0e6",
              200: "#e6c1ce",
              300: "#d99bb5",
              400: "#cc749c",
              500: "#8b1538",
              600: "#7a1230",
              700: "#690f28",
              800: "#580c20",
              900: "#470918",
              DEFAULT: "#8b1538",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#00d4ff",
              foreground: "#000000",
            },
            warning: {
              DEFAULT: "#f4d03f",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#ff4757",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
}