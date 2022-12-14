const router = require('express').Router();
const invoiceController = require('./controller');
const { policy_check } = require('../../middleware/middleware');

router.get('/invoices/:order_id', policy_check('view', 'Invoice'), invoiceController.show);

module.exports = router;
