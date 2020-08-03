const express = require('express')
const controller = require('../controller/OrderController')
const validator = require('../validations/OrderValidation')
const router = express.Router()

router.route('/orders/').post(validator.create, controller.create)
router.route('/orders/').put(validator.update, controller.update)
router.route('/orders/:id').get(controller.show)
router.route('/orders/:id').delete(controller.destroy)

module.exports = router
