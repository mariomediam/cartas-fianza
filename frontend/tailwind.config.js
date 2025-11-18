/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0f7',
          100: '#d1e1ef',
          200: '#a3c3df',
          300: '#75a5cf',
          400: '#4787bf',
          500: '#2c5f8d', // Color principal UNF
          600: '#234c71',
          700: '#1a3955',
          800: '#112639',
          900: '#09131c',
        },
        secondary: {
          50: '#e9f5ed',
          100: '#d3ebdb',
          200: '#a7d7b7',
          300: '#7bc393',
          400: '#4faf6f',
          500: '#4a9d5f', // Color secundario UNF
          600: '#3b7e4c',
          700: '#2c5e39',
          800: '#1e3f26',
          900: '#0f1f13',
        },
        dark: {
          DEFAULT: '#0d1b2a',
          50: '#e6e8ea',
          100: '#cdd1d5',
          200: '#9ba3ab',
          300: '#697581',
          400: '#374757',
          500: '#0d1b2a',
          600: '#0a1622',
          700: '#081019',
          800: '#050b11',
          900: '#030508',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

