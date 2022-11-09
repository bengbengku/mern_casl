const router = require('express').Router()
const { policy_check } = require('../../middleware/middleware')
const categoryController = require('./controller')

router.get('/category', categoryController.index)
router.post(
  '/category',
  policy_check('create', 'Category'),
  categoryController.store
)
router.put(
  '/category/:id',
  policy_check('update', 'Category'),
  categoryController.update
)
router.delete(
  '/category/:id',
  policy_check('delete', 'Category'),
  categoryController.destroy
)

module.exports = router
