import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        white: "var(--white)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        muted: "var(--muted)",
        line: "var(--line)",
        brand: "var(--brand)",
        "brand-dark": "var(--brand-dark)",
        "brand-soft": "var(--brand-soft)",
        carbon: "var(--carbon)",
        steel: "var(--steel)",
        data1: "var(--data1)",
        data2: "var(--data2)",
        data3: "var(--data3)",
        data4: "var(--data4)",
        data5: "var(--data5)",
      },
      fontFamily: {
        sans: ["var(--font-cn)"],
        display: ["var(--font-display)"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,23,26,.04), 0 12px 32px rgba(20,23,26,.06)",
        lift: "0 8px 30px rgba(20,23,26,.12)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      maxWidth: {
        prose: "760px",
        shell: "1240px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.2,.7,.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
