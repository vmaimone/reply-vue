const renderViewModel = require('./render-view-model')

function register(server, options, next) {
  server.decorate('reply', 'vue', function ViewModel(data = {}) {
    return renderViewModel(this.request, data)
      .then(app => this.response(app))
      .catch(({ code, data }) => {
        this.response(data).code(code)
      })
  })
  next()
}

exports.register = register

exports.register.attributes = {
  name: 'reply-vue',
  version: '0.0.1'
}
