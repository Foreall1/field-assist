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
        field: {
          // Primary brand colors from field.nl
          primary: '#288978',
          'primary-dark': '#1e6b5c',
          secondary: '#33a370',

          // Dark tones
          navy: '#2c3e50',
          slate: '#415161',
          dark: '#1a2634',

          // Light/neutral tones
          gray: {
            100: '#f8f9fb',
            200: '#edeff2',
            300: '#E2E7ED',
            400: '#c5cdd6',
            500: '#8b97a5',
          },

          // Accent
          accent: '#33a370',
          white: '#ffffff',
        },
      },
      fontFamily: {
        // FIELD uses a clean sans-serif system
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid typography matching field.nl
        'fluid-sm': 'clamp(0.813rem, 0.75rem + 0.25vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.925rem + 0.375vw, 1.25rem)',
        'fluid-lg': 'clamp(1.375rem, 1.2rem + 0.625vw, 1.875rem)',
        'fluid-xl': 'clamp(1.875rem, 1.5rem + 1.563vw, 3.125rem)',
        'fluid-2xl': 'clamp(2.813rem, 2rem + 2.734vw, 5rem)',
      },
      spacing: {
        // FIELD spacing scale
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        // FIELD shadow presets
        'field': '0 4px 20px rgba(40, 137, 120, 0.08)',
        'field-md': '0 8px 30px rgba(40, 137, 120, 0.12)',
        'field-lg': '0 12px 50px rgba(40, 137, 120, 0.15)',
        'natural': '6px 6px 9px rgba(0, 0, 0, 0.1)',
        'deep': '12px 12px 50px rgba(0, 0, 0, 0.15)',
        'card': '0 2px 8px rgba(44, 62, 80, 0.06)',
        'card-hover': '0 8px 25px rgba(44, 62, 80, 0.1)',
      },
      borderRadius: {
        'field': '0.625rem',
        'field-lg': '1rem',
        'field-xl': '1.5rem',
      },
      transitionTimingFunction: {
        'field': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
