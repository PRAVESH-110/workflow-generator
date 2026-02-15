import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
