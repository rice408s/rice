import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F0F1A",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          extend: "dark",
          colors: {
            background: "#0F0F1A",
            primary: {
              DEFAULT: "#6366f1",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
    require('@tailwindcss/typography'),
  ],
} 