'use strict'
const { v4: uuid } = require('uuid')
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'categories'
  })

  Category.associate = function (models) {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE',
      hook: true
    })
  }

  Category.beforeCreate(category => { category.id = uuid() })
  sequelizePaginate.paginate(Category)

  return Category
}
