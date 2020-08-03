const express = require('express')
const controller = require('../controller/CategoryController')
const router = express.Router()

router.route('/categories/').get(controller.index)
router.route('/categories/:id').get(controller.show)

module.exports = router
