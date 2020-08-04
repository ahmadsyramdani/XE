const { Op, sequelize } = require('../models')
const CommonBaseDAO = require('./CommonBaseDAO')

class BaseDAO extends CommonBaseDAO {
  constructor (options) {
    options.Op = Op
    options.sequelize = sequelize
    super(options)
  }
}

module.exports = BaseDAO
