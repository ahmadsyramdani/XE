const { sequelize } = require('../models')

class HealthDAO {
  ping () {
    return sequelize
      .authenticate().then(() => {
        return true
      })
      .catch(err => {
        console.log('err: ', err)
        return false
      })
  }
}

module.exports = HealthDAO
