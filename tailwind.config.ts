import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#e8edf3",
          100: "#c5d1df",
          200: "#9eb2c9",
          300: "#7793b2",
          400: "#577da1",
          500: "#366690",
          600: "#2a5580",
          700: "#1e4470",
          800: "#1B3A5C",
          900: "#112440",
          950: "#0a1728",
        },
        gold: {
          400: "#e3a63f",
          500: "#C8952A",
          600: "#a87920",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans:  ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "68ch",
            color: "#1b1a14",
            a: { color: "#14283f", textDecoration: "underline" },
            "h1,h2,h3,h4": { fontFamily: "var(--font-fraunces)", color: "#1b1a14" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
