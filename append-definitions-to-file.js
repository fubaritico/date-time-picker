import * as fs from 'fs'

const filePath = 'dist/index.d.ts'
const contentToPrepend = '/// <reference path="./global.d.ts" />\n'

// First, read the existing content
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }

  // Combine the new content with existing content
  const newContent = contentToPrepend + data

  // Write the combined content back to the file
  fs.writeFile(filePath, newContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err)
      return
    }
    console.log('Successfully prepended definitions to ' + filePath)
  })
})
