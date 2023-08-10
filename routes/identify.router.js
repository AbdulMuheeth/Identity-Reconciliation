const express = require('express')
const router = express.Router()

const identifyController = require('../controllers/identify.controller')

router.post('/',identifyController.getMatched)
router.get('/',identifyController.msg)

module.exports = router