import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#090b12',
        panel: '#121726',
        line: 'rgba(255,255,255,0.08)',
        glow: '#f97316',
        ice: '#60a5fa'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.35), 0 0 80px rgba(249,115,22,0.12)'
      },
      backgroundImage: {
        arena:
          'radial-gradient(circle at top, rgba(96,165,250,0.14), transparent 28%), radial-gradient(circle at 80% 10%, rgba(249,115,22,0.16), transparent 24%), linear-gradient(180deg, #090b12 0%, #0b1020 100%)'
      }
    }
  },
  plugins: []
};

export default config;
