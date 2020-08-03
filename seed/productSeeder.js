'use strict'

const { Product, Category } = require('../models')
const faker = require('faker')

const forSeed = async _ => {
  console.log('Start')
  if (process.env.NODE_ENV === 'development') {
    console.log("Delete Category & Product")
    await Category.destroy({
      truncate: true
    })
    await Product.destroy({
      truncate: true
    })
  }
  for (let index = 0; index < 5; index++) {
    const category = await Category.create({
      name: faker.commerce.product()
    }).then(async category => {
      for(let newIndex = 0; newIndex < 6; newIndex++) {
        await category.createProduct({
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
          description: faker.lorem.sentence(),
          imageUrl: 'http://lorempixel.com/640/480',
          stock: 100
        })
      }
    })
  }

  console.log('End')
}

forSeed()
