module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-nested'),
    require('postcss-import')({
      filter: (value) => {
        const excludedImports = [
          /*'./styles/button.css'*/
        ]

        return !excludedImports.includes(value)
      },
    }),
    require('postcss-minify'),
  ],
}
