module.exports = {
  content: ["./**/*.html"],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    styled: true,
    utils: true,
    themes: ["dracula", "retro"],
  }
};