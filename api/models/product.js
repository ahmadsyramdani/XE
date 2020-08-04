'use strict'
const { v4: uuid } = require('uuid')
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    categoryId: DataTypes.UUID,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'products'
  })

  Product.associate = function (models) {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId'
    })

    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId'
    })
  }

  Product.beforeCreate(product => { product.id = uuid() })
  sequelizePaginate.paginate(Product)

  return Product
}
