module.exports = {
  content: ["./**/*.html"],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
      textColor: {
        primary: color("--color-text-primary")
      },
      backgroundColor: {
        primary: color("--color-bg-primary")
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
