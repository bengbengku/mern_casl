const router = require('express').Router()
const { policy_check } = require('../../middleware/middleware')
const cartItemsController = require('./controller')

router.put('/carts', policy_check('update', 'Cart'), cartItemsController.update)

router.get('/carts', policy_check('read', 'Cart'), cartItemsController.index)

module.exports = router
