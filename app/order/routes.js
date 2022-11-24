const router = require('express').Router()
const { policy_check } = require('../../middleware/middleware')
const orderController = require('./controller')

router.post('/orders', policy_check('create', 'Order'), orderController.store)
router.get('/orders', policy_check('view', 'Order'), orderController.index)

module.exports = router
