/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      'grey': '#242424',
      'lgrey': '#424242'
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

