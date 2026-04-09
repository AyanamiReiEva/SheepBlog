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
        background: "#FFFFFF",
        foreground: "#1a1a1a",
        border: "#f0f0f0",
        primary: "#1e3a5f",
        "primary-foreground": "#ffffff",
        muted: "#f8f8f8",
        "muted-foreground": "#666666",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      maxWidth: {
        "content": "720px",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
