const fs = require('fs')

function parse(fileContents) {
  return fileContents.match(/^([\s\S]+?<html)([\s\S]+?)(<\/head>[\s\S]*?<body)([\s\S]+?)<div id="?app"?><\/div>([\s\S]+)$/)
}

function IndexHtml(dir) {
  const [
    entire,
    htmlOpen,
    htmlOpenTailAndHead,
    headCloseAndBodyOpen,
    bodyOpenTailAndContentBeforeApp,
    contentAfterAppAndHtmlClose
  ] = parse(fs.readFileSync(`${dir}/index.html`, 'utf8'))

  return {
    entire,
    htmlOpen,
    htmlOpenTailAndHead,
    headCloseAndBodyOpen,
    bodyOpenTailAndContentBeforeApp,
    contentAfterAppAndHtmlClose
  }
}

if (process.env.NODE_ENV !== 'production') {
  module.exports = {
    indexHtml: new IndexHtml('dist'),
    bundle: fs.readFileSync('dist/server.js', 'utf8')
  }
} else {
  module.exports = {
    indexHtml: new IndexHtml('dist'),
    bundle: fs.readFileSync('dist/server.js', 'utf8')
  }
}
