import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "7xl": "80rem",
      },
      fontFamily: {
        "playfair": ["var(--font-playfair)"],
        "montserrat": ["var(--font-montserrat)"],
        "lora": ["var(--font-lora)"],
      },
      colors: {
        gray: {
          900: "#171717",
          500: "#737373",
        },
        coral: {
          50: '#fff5f2',
          100: '#ffe6df',
          200: '#ffc7b8',
          300: '#ffa391',
          400: '#ff7a5c',
          500: '#ff5c3a',
          600: '#ed3c16',
          700: '#c52f0f',
          800: '#9f2912',
          900: '#822614',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
