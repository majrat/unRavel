/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accentColor: "#658864",
        primaryColor: "#B7B78A",
        lightColor: "#EEEEEE",
        secondaryColor: "#DDDDDD"
      },
    },
  },
  plugins: [],
};
