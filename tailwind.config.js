/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './dev/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'elevation-1': '0 1px 4px 0 rgba(0, 0, 0, 0.08)',
        'elevation-2':
          '0 4px 6px 0 rgba(0, 0, 0, 0.05), 0 10px 15px 0 rgba(0, 0, 0, 0.1)',
      },
    },
    fontFamily: {
      //body: ['Poppins', 'sans-serif'],
      roboto: ['Roboto', 'sans-serif'],
      robotoMono: ['RobotoMono', 'sans-serif'],
    },
  },
  plugins: [],
}
