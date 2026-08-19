/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        primary: {
          DEFAULT: "var(--color-primary)",
          muted: "var(--color-primary-muted)",
          foreground: "var(--color-primary-foreground)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },
        border: "var(--color-border)",
        "border-hover": "var(--color-border-hover)",
        
        // Shadcn mappings
        input: "var(--color-border)",
        ring: "var(--color-primary)",
        background: "var(--color-surface)",
        foreground: "var(--color-text)",
        secondary: {
          DEFAULT: "var(--color-surface-muted)",
          foreground: "var(--color-text)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-surface-muted)",
          foreground: "var(--color-text-muted)",
        },
        accent: {
          DEFAULT: "var(--color-surface-muted)",
          foreground: "var(--color-text)",
        },
        popover: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text)",
        },
        card: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text)",
        },
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "outline": "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        "stitch-primary": "var(--stitch-primary)",
        "stitch-secondary": "var(--stitch-secondary)",
        "stitch-background": "var(--stitch-background)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        "surface": "var(--color-surface)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans"],
        "label-md": ["Inter"],
        "label-sm": ["Inter"],
        "body-lg": ["Inter"],
        "headline-lg": ["Plus Jakarta Sans"],
        "body-sm": ["Inter"],
        "headline-lg-mobile": ["Plus Jakarta Sans"],
        "headline-xl": ["Plus Jakarta Sans"],
        "body-md": ["Inter"]
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        hover: "var(--shadow-hover)",
      },
      spacing: {
        "sm": "8px",
        "xl": "48px",
        "base": "4px",
        "xs": "4px",
        "gutter": "16px",
        "md": "16px",
        "container-margin": "24px",
        "lg": "24px"
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}