/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "Inter", "sans-serif"],
        display: ["Cal Sans", "Inter var", "sans-serif"],
      },
      fontSize: {
        '2xs': ['0.625rem', '0.75rem'],
        xs: ['0.75rem', '1rem'],
        sm: ['0.875rem', '1.25rem'],
        base: ['1rem', '1.5rem'],
        lg: ['1.125rem', '1.75rem'],
        xl: ['1.25rem', '1.75rem'],
        '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.25rem'],
        '4xl': ['2.25rem', '2.5rem'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        shimmer: 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'fade-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        glow: {
          from: {
            boxShadow: '0 0 20px rgba(var(--primary-500), 0.3)',
          },
          to: {
            boxShadow: '0 0 30px rgba(var(--primary-500), 0.6)',
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui",
      addCommonColors: true,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "1rem",
          large: "1.125rem"
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem"
        },
        radius: {
          small: "0.5rem",
          medium: "0.75rem",
          large: "1rem"
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px"
        },
        boxShadow: {
          small: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          medium: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          large: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
        },
        dividerWeight: "1px",
        disabledOpacity: ".5"
      },
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: "#ffffff",
              50: "#ffffff",
              100: "#fefefe",
              200: "#fdfdfd",
              300: "#fcfcfc",
              400: "#fafafa",
              500: "#f9f9f9",
              600: "#f8f8f8",
              700: "#f7f7f7",
              800: "#f5f5f5",
              900: "#f4f4f4",
              foreground: "#11181C"
            },
            foreground: {
              DEFAULT: "#11181C",
              50: "#687076",
              100: "#5E676E",
              200: "#535B61",
              300: "#494F54",
              400: "#3E4347",
              500: "#11181C",
              600: "#0C1114",
              700: "#070A0C",
              800: "#030404",
              900: "#000000",
              foreground: "#ffffff"
            },
            divider: {
              DEFAULT: "#e2e8f0",
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b",
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0f172a",
              foreground: "#11181C"
            },
            overlay: {
              DEFAULT: "rgba(0, 0, 0, 0.4)",
              50: "rgba(0, 0, 0, 0.1)",
              100: "rgba(0, 0, 0, 0.2)",
              200: "rgba(0, 0, 0, 0.3)",
              300: "rgba(0, 0, 0, 0.4)",
              400: "rgba(0, 0, 0, 0.5)",
              500: "rgba(0, 0, 0, 0.6)",
              600: "rgba(0, 0, 0, 0.7)",
              700: "rgba(0, 0, 0, 0.8)",
              800: "rgba(0, 0, 0, 0.9)",
              900: "rgba(0, 0, 0, 1)",
              foreground: "#ffffff"
            },
            content1: {
              DEFAULT: "#ffffff",
              50: "#ffffff",
              100: "#fefefe",
              200: "#fdfdfd",
              300: "#fcfcfc",
              400: "#fafafa",
              500: "#f9f9f9",
              600: "#f8f8f8",
              700: "#f7f7f7",
              800: "#f5f5f5",
              900: "#f4f4f4",
              foreground: "#11181C"
            },
            content2: {
              DEFAULT: "#f9fafb",
              50: "#ffffff",
              100: "#fefefe",
              200: "#fdfdfd",
              300: "#fcfcfc",
              400: "#fbfbfb",
              500: "#f9fafb",
              600: "#f8f9fa",
              700: "#f7f8f9",
              800: "#f6f7f8",
              900: "#f5f6f7",
              foreground: "#11181C"
            },
            content3: {
              DEFAULT: "#f3f4f6",
              50: "#ffffff",
              100: "#fefefe",
              200: "#fdfdfd",
              300: "#fcfcfc",
              400: "#fbfbfb",
              500: "#f3f4f6",
              600: "#f2f3f5",
              700: "#f1f2f4",
              800: "#f0f1f3",
              900: "#eff0f2",
              foreground: "#11181C"
            },
            content4: {
              DEFAULT: "#e5e7eb",
              50: "#ffffff",
              100: "#fefefe",
              200: "#fdfdfd",
              300: "#fcfcfc",
              400: "#fbfbfb",
              500: "#e5e7eb",
              600: "#e4e6ea",
              700: "#e3e5e9",
              800: "#e2e4e8",
              900: "#e1e3e7",
              foreground: "#11181C"
            },
            primary: {
              50: "#f0f9ff",
              100: "#e0f2fe",
              200: "#bae6fd",
              300: "#7dd3fc",
              400: "#38bdf8",
              500: "#0ea5e9",
              600: "#0284c7",
              700: "#0369a1",
              800: "#075985",
              900: "#0c4a6e",
              DEFAULT: "#0ea5e9",
              foreground: "#ffffff"
            },
            secondary: {
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#8b5cf6",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
              DEFAULT: "#8b5cf6",
              foreground: "#ffffff"
            },
            success: {
              50: "#f0fdf4",
              100: "#dcfce7",
              200: "#bbf7d0",
              300: "#86efac",
              400: "#4ade80",
              500: "#22c55e",
              600: "#16a34a",
              700: "#15803d",
              800: "#166534",
              900: "#14532d",
              DEFAULT: "#22c55e",
              foreground: "#ffffff"
            },
            warning: {
              50: "#fff7ed",
              100: "#ffedd5",
              200: "#fed7aa",
              300: "#fdba74",
              400: "#fb923c",
              500: "#f97316",
              600: "#ea580c",
              700: "#c2410c",
              800: "#9a3412",
              900: "#7c2d12",
              DEFAULT: "#f97316",
              foreground: "#ffffff"
            },
            danger: {
              50: "#fef2f2",
              100: "#fee2e2",
              200: "#fecaca",
              300: "#fca5a5",
              400: "#f87171",
              500: "#ef4444",
              600: "#dc2626",
              700: "#b91c1c",
              800: "#991b1b",
              900: "#7f1d1d",
              DEFAULT: "#ef4444",
              foreground: "#ffffff"
            },
            focus: {
              DEFAULT: "#0ea5e9",
              50: "#f0f9ff",
              100: "#e0f2fe",
              200: "#bae6fd",
              300: "#7dd3fc",
              400: "#38bdf8",
              500: "#0ea5e9",
              600: "#0284c7",
              700: "#0369a1",
              800: "#075985",
              900: "#0c4a6e",
              foreground: "#ffffff"
            }
          }
        },
        dark: {
          colors: {
            background: {
              DEFAULT: "#0f172a",
              50: "#1e293b",
              100: "#1a2436",
              200: "#162031",
              300: "#121b2c",
              400: "#0e1727",
              500: "#0f172a",
              600: "#0b1221",
              700: "#070e19",
              800: "#040910",
              900: "#000407",
              foreground: "#ffffff"
            },
            foreground: {
              DEFAULT: "#ffffff",
              50: "#f9fafb",
              100: "#f3f4f6",
              200: "#e5e7eb",
              300: "#d1d5db",
              400: "#9ca3af",
              500: "#6b7280",
              600: "#4b5563",
              700: "#374151",
              800: "#1f2937",
              900: "#111827",
              foreground: "#0f172a"
            },
            divider: {
              DEFAULT: "#334155",
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b",
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0f172a",
              foreground: "#ffffff"
            },
            overlay: {
              DEFAULT: "rgba(0, 0, 0, 0.4)",
              50: "rgba(0, 0, 0, 0.1)",
              100: "rgba(0, 0, 0, 0.2)",
              200: "rgba(0, 0, 0, 0.3)",
              300: "rgba(0, 0, 0, 0.4)",
              400: "rgba(0, 0, 0, 0.5)",
              500: "rgba(0, 0, 0, 0.6)",
              600: "rgba(0, 0, 0, 0.7)",
              700: "rgba(0, 0, 0, 0.8)",
              800: "rgba(0, 0, 0, 0.9)",
              900: "rgba(0, 0, 0, 1)",
              foreground: "#ffffff"
            },
            content1: {
              DEFAULT: "#1e293b",
              50: "#1e293b",
              100: "#1a2436",
              200: "#162031",
              300: "#121b2c",
              400: "#0e1727",
              500: "#0a1222",
              600: "#060d1d",
              700: "#020818",
              800: "#000313",
              900: "#00000e",
              foreground: "#ffffff"
            },
            content2: {
              DEFAULT: "#0f172a",
              50: "#1e293b",
              100: "#1a2436",
              200: "#162031",
              300: "#121b2c",
              400: "#0e1727",
              500: "#0f172a",
              600: "#0b1221",
              700: "#070e19",
              800: "#040910",
              900: "#000407",
              foreground: "#ffffff"
            },
            content3: {
              DEFAULT: "#0a1222",
              50: "#1e293b",
              100: "#1a2436",
              200: "#162031",
              300: "#121b2c",
              400: "#0e1727",
              500: "#0a1222",
              600: "#060d1d",
              700: "#020818",
              800: "#000313",
              900: "#00000e",
              foreground: "#ffffff"
            },
            content4: {
              DEFAULT: "#060d1d",
              50: "#1e293b",
              100: "#1a2436",
              200: "#162031",
              300: "#121b2c",
              400: "#0e1727",
              500: "#060d1d",
              600: "#020818",
              700: "#000313",
              800: "#00000e",
              900: "#000009",
              foreground: "#ffffff"
            },
            primary: {
              50: "#f0f9ff",
              100: "#e0f2fe",
              200: "#bae6fd",
              300: "#7dd3fc",
              400: "#38bdf8",
              500: "#0ea5e9",
              600: "#0284c7",
              700: "#0369a1",
              800: "#075985",
              900: "#0c4a6e",
              DEFAULT: "#0ea5e9",
              foreground: "#ffffff"
            },
            secondary: {
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#8b5cf6",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
              DEFAULT: "#8b5cf6",
              foreground: "#ffffff"
            },
            success: {
              50: "#f0fdf4",
              100: "#dcfce7",
              200: "#bbf7d0",
              300: "#86efac",
              400: "#4ade80",
              500: "#22c55e",
              600: "#16a34a",
              700: "#15803d",
              800: "#166534",
              900: "#14532d",
              DEFAULT: "#22c55e",
              foreground: "#ffffff"
            },
            warning: {
              50: "#fff7ed",
              100: "#ffedd5",
              200: "#fed7aa",
              300: "#fdba74",
              400: "#fb923c",
              500: "#f97316",
              600: "#ea580c",
              700: "#c2410c",
              800: "#9a3412",
              900: "#7c2d12",
              DEFAULT: "#f97316",
              foreground: "#ffffff"
            },
            danger: {
              50: "#fef2f2",
              100: "#fee2e2",
              200: "#fecaca",
              300: "#fca5a5",
              400: "#f87171",
              500: "#ef4444",
              600: "#dc2626",
              700: "#b91c1c",
              800: "#991b1b",
              900: "#7f1d1d",
              DEFAULT: "#ef4444",
              foreground: "#ffffff"
            },
            focus: {
              DEFAULT: "#0ea5e9",
              50: "#f0f9ff",
              100: "#e0f2fe",
              200: "#bae6fd",
              300: "#7dd3fc",
              400: "#38bdf8",
              500: "#0ea5e9",
              600: "#0284c7",
              700: "#0369a1",
              800: "#075985",
              900: "#0c4a6e",
              foreground: "#ffffff"
            }
          }
        }
      }
    }),
    function({ addUtilities }) {
      addUtilities({
        '.bg-gradient-fade-t': {
          'background-image': 'linear-gradient(to top, var(--tw-gradient-stops))',
        },
        '.bg-gradient-fade-b': {
          'background-image': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        },
        '.bg-gradient-radial-center': {
          'background-image': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        },
      });
    },
  ],
};