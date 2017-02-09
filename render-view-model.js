const { createBundleRenderer } = require('vue-server-renderer')
const { indexHtml, bundle } = require('./index-html')

const renderer = createBundleRenderer(bundle)

module.exports = function renderViewModel(request, data = {}) {
  return new Promise((resolve, reject) => {
    const url = request.url
    const params = request.params
    const context = { url, params }
    if (data) {
      context.data = data
    }

    let output = ''

    const renderStream = renderer.renderToStream(context)

    renderStream.once('data', () => {
      const { title, htmlAttrs, bodyAttrs, link, style, script, noscript, meta } = context.meta.inject()

      const doc = `
      ${indexHtml.htmlOpen} data-vue-meta-server-rendered ${htmlAttrs.text()} ${indexHtml.htmlOpenTailAndHead}
      ${meta.text()}
      ${title.text()}
      ${link.text()}
      ${style.text()}
      ${script.text()}
      ${noscript.text()}
      ${indexHtml.headCloseAndBodyOpen} ${bodyAttrs.text()} ${indexHtml.bodyOpenTailAndContentBeforeApp}
    `
      output += doc
    })

    renderStream.on('data', chunk => {
      output += chunk
    })

    renderStream.on('end', () => {
      const chunk = `
      <script>
        window.__INITIAL_COMPONENTS_STATE__ = ${JSON.stringify(context.initialComponentsState)}
        window.__INITIAL_VUEX_STATE__ = ${JSON.stringify(context.initialVuexState)}
      </script>
      ${indexHtml.contentAfterAppAndHtmlClose}
    `
      output += chunk
      return resolve(output)
    })

    renderStream.on('error', err => {
      if (err && err.code === '404') {
        // let client to render a 404 page
        return reject({ code: 404, data: indexHtml.entire })
      } else {
        // let client to render a 500 page
        console.error(`error during render : ${url}`) // eslint-disable-line
        console.error(err) // eslint-disable-line
        return reject({ code: 500, data: indexHtml.entire })
      }
    })
  })
}
