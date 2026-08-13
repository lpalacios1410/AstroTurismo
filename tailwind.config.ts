import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        celestial: {
          bg: '#020305',
          card: '#05070A',
          teal: '#00F5FF',
          purple: '#BC13FE',
          text: '#EAF2FF',
          muted: '#93A0C4',
          line: 'rgba(255, 255, 255, 0.10)',
          glass: 'rgba(255, 255, 255, 0.06)',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-teal': '0 0 15px rgba(0, 245, 255, 0.25)',
        'neon-hover': '0 0 15px rgba(0, 245, 255, 0.5)',
        'neon-purple': '0 0 15px rgba(188, 19, 254, 0.35)',
        'glow-teal': '0 0 30px rgba(0, 245, 255, 0.25)',
        'glow-purple': '0 0 30px rgba(188, 19, 254, 0.3)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        twinkle: 'twinkle 4s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
