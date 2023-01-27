/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        accentColor: '#658864',
        primaryColor: '#B7B78A',
        lightColor: '#EEEEEE',
        secondaryColor: '#DDDDDD',
      },
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
}
