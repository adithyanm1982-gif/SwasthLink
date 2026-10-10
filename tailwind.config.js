// Colours come from CSS variables (see src/index.css), so one switch re-themes the entire site.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // The site is sharp-edged. Rounded sizes exist only for the AI assistant surfaces.
    borderRadius: { none: "0", DEFAULT: "0", md: "6px", xl: "12px", "2xl": "16px", "3xl": "24px", full: "9999px" },
    extend: {
      colors: {
        white: v("c-white"), black: v("c-black"),
        zinc: { 50: v("z50"), 100: v("z100"), 200: v("z200"), 300: v("z300"), 400: v("z400"), 500: v("z500"), 600: v("z600"), 700: v("z700"), 800: v("z800"), 900: v("z900") },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], mono: ["JetBrains Mono", "ui-monospace", "Menlo", "monospace"] },
    },
  },
  plugins: [],
};
