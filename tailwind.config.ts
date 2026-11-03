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
        btn: "8px",
        input: "8px",
        "card-sm": "10px",
        card: "12px",
        modal: "16px",
        pill: "999px",
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0, 0, 0, 0.28)",
        modal: "0 12px 32px rgba(0, 0, 0, 0.35)",
        floating: "0 8px 24px rgba(0, 0, 0, 0.28)",
      },
    },
  },
  plugins: [],
};
export default config;
