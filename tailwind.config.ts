
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Impact', 'Haettenschweiler', 'Franklin Gothic Bold', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        grunge: ['"Urban Hookupz"', '"Permanent Marker"', 'cursive'],
        'street': ['"Street Writer"', 'cursive'],
        'urban': ['"Urban Hookupz"', 'cursive'],
        'graffont': ['Graffont', 'cursive'],
        'nosegrind': ['Nosegrind', 'cursive']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: '#eedd44', foreground: '#1a1a1a' }, // Keep the requested yellow
        neon: "#FFFB00",
        grunge: "#181820",
        paper: "#23232f",
        accent: "#8B5CF6",
        muted: "#444",
        card: { DEFAULT: "#18181b", foreground: "#f9f9f9" }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'reveal': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'spotlight': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px 0 rgba(255, 215, 0, 0.4)' },
          '50%': { boxShadow: '0 0 30px 0 rgba(255, 215, 0, 0.6)' }
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'reveal': 'reveal 0.8s ease-out forwards',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'spotlight': 'spotlight 1s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s infinite',
        'text-shimmer': 'text-shimmer 2s linear infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
