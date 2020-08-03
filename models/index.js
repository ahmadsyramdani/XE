'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const sequelize = new Sequelize(config.postgres.database, config.postgres.username, config.postgres.password, config.postgres)
const db = {}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'mongo')
  })
  .forEach(function (file) {
    if (fs.lstatSync(path.join(__dirname, file)).isDirectory()) {
      fs
        .readdirSync(path.join(__dirname, file))
        .filter(function (fileConnect) {
          return (fileConnect.indexOf('.') !== 0) && (fileConnect !== 'index.js') && (fileConnect !== 'mongo')
        })
        .forEach(function (fileConnect) {
          const model = sequelize.import(path.join(__dirname, file, fileConnect))
          db[model.name] = model
        })
    } else {
      const model = sequelize.import(path.join(__dirname, file))
      db[model.name] = model
    }
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db.Op = Sequelize.Op

module.exports = db
