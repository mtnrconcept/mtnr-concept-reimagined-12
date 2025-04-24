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
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        'street': ['"Street Writer"', 'cursive'],
        'urban': ['"Urban Hookupz"', 'cursive'],
        'graffont': ['Graffont', 'cursive'],
        'garage': ['"Garage Shock"', 'cursive'],
        'marker': ['"Permanent Marker"', 'cursive'],
        'rocksalt': ['"Rock Salt"', 'cursive'],
        'nosegrind': ['Nosegrind', 'cursive'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: '#eedd44', foreground: '#1a1a1a' }, // Néon jaune
        neon: "#FFFB00",
        grunge: "#181820",
        paper: "#23232f",
        accent: "#8B5CF6",
        muted: "#444", // foncé-vernis
        card: { DEFAULT: "#18181b", foreground: "#f9f9f9" },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg) scale(1)" },
          "50%": { transform: "rotate(3deg) scale(1.02)" }
        },
        spray: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '0.6' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        spotlight: {
          "0%": {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          "100%": {
            opacity: '1',
            transform: 'translate(-50%,-40%) scale(1)',
          }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        wiggle: "wiggle 0.3s ease-in-out infinite",
        'spray': 'spray 2s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 2s linear infinite',
        'spotlight': 'spotlight 2s ease .75s forwards',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-down': 'fade-down 0.5s ease-out forwards'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
