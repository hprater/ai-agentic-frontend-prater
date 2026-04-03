const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
    // Keep this! It's what makes your ThemeProvider work
    darkMode: ["class"],

    // Keep this! It tells Tailwind where to look for classes
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx,js,jsx}",
    ],

    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            // 1. ADDING THE GEIST FONT (Liquid Glass style)
            fontFamily: {
                sans: ["Geist", ...fontFamily.sans],
                mono: ["Geist Mono", ...fontFamily.mono],
            },

            // 2. ADDING CUSTOM GLASS COLORS & BLUR
            backdropBlur: {
                xs: '2px',
            },
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
                // Adding specific glass colors for your Federal Theme
                glass: {
                    DEFAULT: "rgba(255, 255, 255, 0.05)",
                    border: "rgba(255, 255, 255, 0.1)",
                    dark: "rgba(15, 23, 42, 0.6)",
                },
                // ... include other shadcn color mappings below (secondary, destructive, etc)
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
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