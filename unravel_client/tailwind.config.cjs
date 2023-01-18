/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accentColor: "#c19892",
        primaryColor: "#d8d7d7",
        lightColor: "#f3f1ef",
        secondaryColor: "#bebfbd"
      },
    },
  },
  plugins: [],
};
