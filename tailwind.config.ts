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
        poalim: {
          red: "#ED1D24",
          redHover: "#D41920",
          redDark: "#B3141A",
          redLight: "#FEF2F2",
          redBorder: "#FECACA",
          gray: "#515254",
          grayLight: "#6B6D6F",
          grayBg: "#F7F7F8",
          black: "#1A1A1A",
          white: "#FFFFFF",
          border: "#E5E5E5",
          borderLight: "#F0F0F0",
        },
      },
      fontFamily: {
        sans: ["Heebo", "Arial", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
