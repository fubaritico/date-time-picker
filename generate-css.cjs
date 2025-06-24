const fs = require('fs')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const minify = require('postcss-minify')
const postcssNested = require('postcss-nested')
const atImport = require('postcss-import')

const sourceFile = 'src/native-styles.css'
const destFile = 'dist/styles.css'

const css = fs.readFileSync(sourceFile, 'utf8')

postcss([autoprefixer, postcssNested])
  .use(
    atImport({
      filter: (value) => {
        const excludedImports = [
          './styles/button.css',
          './styles/dropdown.css',
          './styles/icons.css',
          './styles/menu.css',
          './styles/menu-animation.css',
          './styles/menu-item.css',
        ]

        return !excludedImports.includes(value)
      },
    })
  )
  .use(minify())
  .process(css, {
    from: sourceFile,
  })
  .then((result) => {
    // Remove unused imports left as is by the filter function
    const content = result.css.replace(/@import '(.+?)';/g, () => {
      return ''
    })
    // Write the processed CSS to the destination file
    fs.writeFile(destFile, content, () => true)
  })
