/** @type {import('tailwindcss').Config} */
const { url } = require('inspector');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        // gradient: 'url(../src/assets/gradient.png)',
        fontFamily: {
          primary: ['Inter', 'sans-serif'],
        },
      },
      colors: {
        black: '#000000',
        yellow: '#BDFF00',
        grey: '#858585',
      },
    },
    fontSize: {
      small: ['12px'],
      web_normal: ['14px'],
      web_large: ['36px'],
      web_title: ['48px'],
      mobile_normal: ['10px'],
      mobile_large: ['24px'],
      mobile_title: ['36px'],
    },
  },
  plugins: [],
};
