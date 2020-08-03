const { check } = require('express-validator')

const create = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').not().isEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('phoneNumber', 'Phone Number is required').not().isEmpty(),
  check('shippingAddress', 'Shipping Address is required').not().isEmpty(),
  check('totalPayment', 'Total Payment is required').not().isEmpty(),
  check('orderItems', 'Choose at least 1 item').not().isEmpty()
]

module.exports = { create }
