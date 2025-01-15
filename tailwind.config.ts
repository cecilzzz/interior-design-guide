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
      },
      colors: {
        gray: {
          900: "#171717",
          500: "#737373",
        },
      },
    },
  },
  plugins: [],
};

export default config;
