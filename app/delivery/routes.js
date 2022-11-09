const router = require('express').Router()
const { policy_check } = require('../../middleware/middleware')
const deliveryController = require('./controller')

router.post(
  '/delivery-addresses',
  policy_check('create', 'DeliveryAddress'),
  deliveryController.store
)
router.put('/delivery-addresses/:id', deliveryController.update)

module.exports = router
