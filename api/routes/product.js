const express = require('express')
const controller = require('../controller/ProductController')
const router = express.Router()

router.route('/products/').get(controller.index)
router.route('/products/:id').get(controller.show)

module.exports = router
