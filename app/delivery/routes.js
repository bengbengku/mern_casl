const router = require('express').Router()
const { policy_check } = require('../../middleware/middleware')
const deliveryController = require('./controller')

router.post(
  '/delivery-addresses',
  policy_check('create', 'DeliveryAddress'),
  deliveryController.store
)
router.put('/delivery-addresses/:id', deliveryController.update)
router.delete('/delivery-addresses/:id', deliveryController.destroy)

router.get(
  '/delivery-addresses',
  policy_check('view', 'DeliveryAddress'),
  deliveryController.index
)

module.exports = router
