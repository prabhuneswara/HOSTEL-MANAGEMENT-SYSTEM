/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base neutrals
        bglight: '#FAFAF9',
        bgdark: '#1C1C1E',
        cardlight: '#FFFFFF',
        carddark: '#26262A',
        borderlight: '#E5E4E1',
        borderdark: '#38383C',
        textlight: '#292826',
        textdark: '#EDEDEC',
        mutedlight: '#7A7873',
        muteddark: '#9C9C98',

        // Pastel Accents (Flat, used sparingly)
        sage: {
          DEFAULT: '#8FB8A8', // Primary accent (sage/muted teal)
          hover: '#7AA393',
          dark: '#5A8373',
          tint: 'rgba(143, 184, 168, 0.15)',
        },
        terracotta: {
          DEFAULT: '#E8B4A0', // Secondary / Warning (dusty terracotta)
          dark: '#C8927E',
          tint: 'rgba(232, 180, 160, 0.15)',
        },
        rose: {
          DEFAULT: '#D89A9A', // Danger / Urgent (muted rose)
          dark: '#B87878',
          tint: 'rgba(216, 154, 154, 0.15)',
        },
        softgreen: {
          DEFAULT: '#A8C4A2', // Success (soft sage green)
          dark: '#87A481',
          tint: 'rgba(168, 196, 162, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
