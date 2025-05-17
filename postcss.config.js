export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix: '.dtp',
      includeFiles: ['src/index.css'],
    },
  },
}
