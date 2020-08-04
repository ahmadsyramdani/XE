'use strict'
const { v4: uuid } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    orderId: DataTypes.UUID,
    productId: DataTypes.UUID,
    quantity: DataTypes.INTEGER
  }, {
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'order_items'
  })

  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId'
    })

    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId'
    })
  }

  OrderItem.beforeCreate(item => { item.id = uuid() })

  return OrderItem
}
