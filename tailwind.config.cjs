/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--surface)",
        foreground: "var(--primary)",
        surface: "var(--surface)",
        'surface-container-lowest': "var(--surface-container-lowest)",
        'surface-container-low': "var(--surface-container-low)",
        'surface-container': "var(--surface-container)",
        'surface-container-highest': "var(--surface-container-highest)",
        primary: "var(--primary)",
        'on-primary': "var(--on-primary)",
        'outline-variant': "var(--outline-variant)",
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)'],
        body: ['var(--font-manrope)'],
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px', /* exception for play button */
      }
    },
  },
  plugins: [],
};
