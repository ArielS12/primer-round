import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          contrast: "var(--color-primary-contrast)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          contrast: "var(--color-secondary-contrast)",
        },
        soft: "var(--color-soft)",
        surface: "var(--color-surface)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
        card: "0 4px 20px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      maxWidth: {
        content: "1440px",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
