const express = require('express')
const router = express.Router()
const IndexController = require('../controller/IndexController')

router.get('/', IndexController.index)
router.get('/health', IndexController.health)
router.get('/version', IndexController.version)

module.exports = router
