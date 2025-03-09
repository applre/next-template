import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        white: 'oklch(1 0 0)',
        gray: {
          50: 'oklch(0.98 0.003 var(--gray-hue))',
          100: 'oklch(0.95 0.003 var(--gray-hue))',
          200: 'oklch(0.9 0.003 var(--gray-hue))',
          300: 'oklch(0.85 0.003 var(--gray-hue))',
          400: 'oklch(0.7 0.003 var(--gray-hue))',
          500: 'oklch(0.6 0.003 var(--gray-hue))',
          600: 'oklch(0.5 0.003 var(--gray-hue))',
          700: 'oklch(0.4 0.003 var(--gray-hue))',
          800: 'oklch(0.3 0.003 var(--gray-hue))',
          900: 'oklch(0.2 0.003 var(--gray-hue))',
          950: 'oklch(0.15 0.003 var(--gray-hue))',
        },
        blue: {
          50: 'oklch(0.97 0.02 230)',
          100: 'oklch(0.94 0.04 230)',
          200: 'oklch(0.88 0.08 230)',
          300: 'oklch(0.82 0.12 230)',
          400: 'oklch(0.75 0.16 230)',
          500: 'oklch(0.68 0.19 230)',
          600: 'oklch(0.61 0.17 230)',
          700: 'oklch(0.54 0.15 230)',
          800: 'oklch(0.47 0.13 230)',
          900: 'oklch(0.40 0.11 230)',
          950: 'oklch(0.33 0.09 230)',
        },
        purple: {
          50: 'oklch(0.97 0.02 290)',
          100: 'oklch(0.94 0.04 290)',
          200: 'oklch(0.88 0.08 290)',
          300: 'oklch(0.82 0.12 290)',
          400: 'oklch(0.75 0.16 290)',
          500: 'oklch(0.68 0.19 290)',
          600: 'oklch(0.61 0.17 290)',
          700: 'oklch(0.54 0.15 290)',
          800: 'oklch(0.47 0.13 290)',
          900: 'oklch(0.40 0.11 290)',
          950: 'oklch(0.33 0.09 290)',
        },
        green: {
          50: 'oklch(0.97 0.02 142)',
          100: 'oklch(0.94 0.04 142)',
          200: 'oklch(0.88 0.08 142)',
          300: 'oklch(0.82 0.12 142)',
          400: 'oklch(0.82 0.15 142)',
          500: 'oklch(0.68 0.19 142)',
          600: 'oklch(0.61 0.17 142)',
          700: 'oklch(0.54 0.15 142)',
          800: 'oklch(0.47 0.13 142)',
          900: 'oklch(0.40 0.11 142)',
          950: 'oklch(0.33 0.09 142)',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-react-aria-components'), require('tailwindcss-animate')],
} satisfies Config;

export default config;
