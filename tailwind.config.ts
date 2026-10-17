import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: '#fffbf0',
          100: '#fef4d6',
          200: '#fce6aa',
          300: '#f9d273',
          400: '#f6b93b',
          500: '#e59d1a',
          600: '#c57c12',
          700: '#9d5912',
          800: '#804616',
          900: '#6a3a16',
          gold: '#d4af37',
          roseGold: '#b76e79',
          darkBg: '#0f172a',
          cardBg: '#1e293b',
        }
      },
    },
  },
  plugins: [],
};
export default config;
