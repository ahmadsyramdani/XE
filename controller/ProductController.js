const { Product, Category } = require('../models')
const response = require('../util/response')
const logger = require('../config/logger')
const validateUuid = require('uuid-validate')
const merge = require('merge')

const index = async (req, res) => {
  try {
    const currentPage = req.query.pages || 1
    const category = { 'categoryId': req.query.categoryId }
    const where = { where: merge(category) }
    const options = {
      page: currentPage,
      paginate: 9,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }]
    }
    const { docs, pages, total } = await Product.paginate(req.query.categoryId ? merge(options, where) : options)
    if (docs) {
      response(req, res, 200, { docs, pages, total, currentPage }, 'Ok')
    } else {
      docs.catch(error => {
        logger.error(JSON.stringify(error))
        response(req, res, 500, null, 'Fetch products error', error)
      })
    }
  } catch(error) {
    logger.error(JSON.stringify(error))
    response(req, res, 500, null, 'Fetch products error', error)
  }
}

const show = async (req, res) => {
  try {
    if (!validateUuid(req.params.id)) {
      return response(req, res, 422, null, 'Invalid input syntax for type uuid')
    }

    const product = await Product.findOne({
      where: { id: req.params.id },
      include: [{
        model: Category,
        attributes: ['name']
      }]
    })

    if (!product) {
      return response(req, res, 404, null, 'Data not found')
    }

    if (product) {
      response(req, res, 200, product, 'Ok')
    } else {
      product.catch(error => {
        logger.error(JSON.stringify(error))
        response(req, res, 500, null, 'Fetch product error', error)
      })
    }
  } catch(error) {
    logger.error(JSON.stringify(error))
    response(req, res, 500, null, 'Fetch products error', error)
  }
}

module.exports = { index, show }
