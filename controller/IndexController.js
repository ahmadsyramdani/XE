const resBuilder = require('../builders/response')
const { app: { name } } = require('../config/config')
const { HealthDAO } = require('../dao')

const exec = require('child_process').exec

module.exports = {
  index (req, res, next) {
    res.render('index', { title: name })
  },
  health (req, res, next) {
    const dao = new HealthDAO()
    dao.ping().then(result => {
      resBuilder.ok(res, '', { application: true, database: result })
    }).catch(() => {
      resBuilder.ok(res, '', { application: true, database: false })
    })
  },
  version (req, res, next) {
    exec('git describe --always --tag', (cmdErr, stdout, stderr) => {
      resBuilder.ok(res, '', { name, version: stdout.split('\n').join('') })
    })
  }
}
