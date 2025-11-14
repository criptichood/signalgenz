/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './page-components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
    './services/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'fade-in-out': 'fadeInOut 3s ease-in-out infinite',
        'glow-green': 'card-glow-green 2.5s ease-out',
        'glow-red': 'card-glow-red 2.5s ease-out',
        'toast-in-right': 'toast-in-right 0.3s ease-out',
        'toast-out-right': 'toast-out-right 0.3s ease-out',
        'accordion-down': "accordion-down 0.2s ease-out",
        'accordion-up': "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeInOut: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '15%': { opacity: '1', transform: 'translateY(0)' },
          '85%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        'card-glow-green': {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)', borderColor: 'hsl(var(--border))' },
          '50%': { boxShadow: '0 0 12px 2px rgba(34, 197, 94, 0.5)', borderColor: 'hsl(var(--success))' },
          '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)', borderColor: 'hsl(var(--border))' },
        },
        'card-glow-red': {
          '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)', borderColor: 'hsl(var(--border))' },
          '50%': { boxShadow: '0 0 12px 2px rgba(239, 68, 68, 0.5)', borderColor: 'hsl(var(--error))' },
          '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)', borderColor: 'hsl(var(--border))' },
        },
        'toast-in-right': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'toast-out-right': {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}