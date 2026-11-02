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
        ink: "#13110F",
        ink2: "#2A2520",
        ink3: "#3D3530",
        gold: "#C9A96E",
        gold2: "#A8864E",
        paper: "#F5F0E8",
        paper2: "#EDE8DF",
        paper3: "#E0D9CE",
        muted: "#6B6259",
        faint: "#9E958A",
        rule: "rgba(201, 169, 110, 0.18)",
        rule2: "rgba(201, 169, 110, 0.32)",
        white: "#FDFCF9",
        danger: "#B5402A",
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)", "DM Serif Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
        lg: "6px",
      },
      boxShadow: {
        card: "0 1px 24px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;

