const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')
const hookDir = path.resolve(root, '.git', './hooks')
const githookTemplate = path.resolve(root, '.githook', 'commit-msg.txt')

const readFile = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const writeFile = (raw, target) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(target, raw, { mode: '0755' }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = () => {
  readFile(githookTemplate)
    .then(raw => writeFile(raw, `${hookDir}/commit-msg`))
    .catch(err => { return err })
}
