export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 80px rgba(56, 189, 248, 0.18)',
      },
      backgroundImage: {
        'hero-soft': 'radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.24), transparent 15%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.14), transparent 18%)',
      },
    },
  },
  plugins: [],
};
