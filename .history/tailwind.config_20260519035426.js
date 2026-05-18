import { colors } from "./src/design/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: colors.background,
        txt: colors.text,
        telemetry: colors.telemetry,
        process: colors.process,
        signal: colors.signal,
        border: colors.border,
      },
      fontFamily: {
        sans: ['"Elms Sans"', "Inter", "system-ui", "sans-serif"],
        display: ['"Elms Sans"', "Inter", "system-ui", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "IBM Plex Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
