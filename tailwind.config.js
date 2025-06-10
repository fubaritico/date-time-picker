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
      backgroundImage: {
        storybook: `radial-gradient(
          ellipse at 33%,
          var(--tw-background-gradient-ellipse-1),
          transparent
        ),
        radial-gradient(
          ellipse at 33% 100%,
          var(--tw-background-gradient-ellipse-2) 0%,
          transparent 50%
        ),
        radial-gradient(
          circle at 100% 50%,
          var(--tw-background-gradient-circle-1),
          transparent 50%
        ),
        radial-gradient(
          ellipse at center,
          var(--tw-background-color),
          var(--tw-background-color)
        )`,
      },
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      robotoMono: ['RobotoMono', 'sans-serif'],
    },
  },
  safelist: [
    {
      pattern:
        /(bg|text|border|outline)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-(100|500|600|700|800)/,
      variants: ['hover', 'focus'],
    },
  ],
}
