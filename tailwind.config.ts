import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        custom: {
          crema: "#FFF7ED",
          rosa: "#FADADD",
          celeste: "#DFF2FA",
          text: {
            main: "#4A4A4A",
            sec: "#7A7A7A",
          }
        },
        rosa: {
          DEFAULT: "#F9CBD3",
          50: "#FFF5F6",
          100: "#FFEDF0",
          200: "#FFDBE2",
          300: "#F9CBD3",
          400: "#F4A3B1",
          500: "#F07B8F",
          900: "#B04D5D",
        },
        celeste: {
          DEFAULT: "#BDE3F2",
          50: "#F0F9FF",
          100: "#E0F4FF",
          200: "#BDE3F2",
          400: "#86CEEB",
          500: "#5EB7D9",
          900: "#3D7A94",
        },
        crema: {
          DEFAULT: "#FDF9EC",
          50: "#FFFEFA",
          100: "#FDF9EC",
          200: "#F9F2D4",
          500: "#EBD99D",
          900: "#8C7D4A",
        },
        text: {
          DEFAULT: "#4A4542",
          light: "#7B7570",
          dark: "#2D2A28",
        }
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        sans: ["var(--font-rounded)", "sans-serif"],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      }
    },
  },
  plugins: [],
};
export default config;
