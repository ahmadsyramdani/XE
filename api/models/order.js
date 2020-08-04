'use strict'
const { v4: uuid } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    status: DataTypes.STRING,
    shippingAddress: DataTypes.TEXT,
    totalPayment: DataTypes.FLOAT,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  }, {
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'orders'
  })

  Order.associate = function (models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId'
    })
  }

  Order.beforeCreate(order => { order.id = uuid() })

  return Order
}
