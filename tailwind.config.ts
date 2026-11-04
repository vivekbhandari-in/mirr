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
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        "surface-muted": "var(--surface-muted)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",

        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-muted": "var(--foreground-muted)",
        "foreground-inverse": "var(--foreground-inverse)",

        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-soft": "var(--primary-soft)",

        success: "var(--success)",
        recovery: "var(--recovery)",
        warning: "var(--warning)",
        danger: "var(--danger)",

        // Legacy aliases mapped cleanly
        ink: "var(--background)",
        ink2: "var(--surface)",
        ink3: "var(--surface-elevated)",
        paper: "var(--foreground)",
        muted: "var(--foreground-secondary)",
        faint: "var(--foreground-muted)",
        gold: "var(--primary)",
        gold2: "var(--primary-hover)",
        rule: "var(--border)",
        rule2: "var(--border-strong)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        editorial: ["var(--font-newsreader)", "Newsreader", "DM Serif Display", "Georgia", "serif"],
        serif: ["var(--font-newsreader)", "Newsreader", "DM Serif Display", "Georgia", "serif"],
      },
      borderRadius: {
        btn: "9999px",
        input: "10px",
        "card-sm": "12px",
        card: "16px",
        modal: "20px",
        pill: "9999px",
        DEFAULT: "10px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.02)",
        modal: "0 20px 48px -12px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)",
        floating: "0 10px 30px rgba(0, 0, 0, 0.08)",
        subtle: "0 1px 2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
