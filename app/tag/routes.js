const router = require('express').Router()
const { policy_check } = require('../../middleware/middleware')
const tagController = require('./controller')

router.get('/tags', tagController.index)
router.post('/tags', policy_check('create', 'Tag'), tagController.store)
router.put('/tags/:id', policy_check('update', 'Tag'), tagController.update)
router.delete('/tags/:id', policy_check('delete', 'Tag'), tagController.destroy)

module.exports = router
