const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#F9FAFB",           // Light background
            foreground: "#111827",           // Dark text
            content1: "#FFFFFF",              // White content
            content2: "#F3F4F6",              // Light gray
            content3: "#E5E7EB",              // Light gray
            content4: "#D1D5DB",              // Lighter gray
            primary: {
              DEFAULT: "#007AFF",            // Vibrant Blue (iOS Blue)
              foreground: "#FFFFFF",         // White text on primary
            },
            secondary: "#FF3B30",            // Vibrant Red (iOS Red)
            accent: "#FFCC00",               // Bright Yellow
            success: "#4CD964",              // Green
            warning: "#FF9500",              // Orange
            danger: "#FF3B30",               // Bright Red
            muted: "#E1E4E8",                 // Subtle light gray
          },
          borderRadius: {
            sm: "0.125rem",
            md: "0.375rem",
            lg: "0.5rem",
            xl: "1rem",
            "2xl": "1.5rem",
          },
          boxShadow: {
            soft: "0 2px 8px rgba(0, 0, 0, 0.1)", // Lighter shadow
            strong: "0 4px 12px rgba(0, 0, 0, 0.2)", // Stronger shadow
            focus: "0 0 0 3px rgba(0, 122, 255, 0.5)", // Blue focus shadow
          },
          fontFamily: {
            sans: ["Inter", "sans-serif"],
            display: ["Poppins", "sans-serif"],
          },
        },
        dark: {
          colors: {
            background: "#1C1C1E",          // Dark background
            foreground: "#FFFFFF",          // Light text
            content1: "#2C2C2E",            // Darker gray
            content2: "#3A3A3C",            // Darker gray
            content3: "#48484A",            // Medium gray
            content4: "#636366",            // Lighter gray
            primary: {
              DEFAULT: "#0A84FF",           // Lighter Blue
              foreground: "#FFFFFF",        // White text on primary
            },
            secondary: "#FF3B30",           // Bright Red
            accent: "#FFD60A",              // Bright Yellow
            success: "#32D74B",             // Light Green
            warning: "#FF9F0A",             // Light Orange
            danger: "#FF3B30",              // Bright Red
            muted: "#2C2C2E",               // Dark gray
          },
          borderRadius: {
            sm: "0.125rem",
            md: "0.375rem",
            lg: "0.5rem",
            xl: "1rem",
            "2xl": "1.5rem",
          },
          boxShadow: {
            soft: "0 2px 8px rgba(255, 255, 255, 0.1)", // Lighter shadow
            strong: "0 4px 12px rgba(255, 255, 255, 0.2)", // Stronger shadow
            focus: "0 0 0 3px rgba(10, 132, 255, 0.5)", // Blue focus shadow
          },
          fontFamily: {
            sans: ["Inter", "sans-serif"],
            display: ["Poppins", "sans-serif"],
          },
        },
      },
    }),
  ],
};
