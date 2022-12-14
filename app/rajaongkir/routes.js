const router = require('express').Router();
const rajaOngkirController = require('./controller');

router.get('/province', rajaOngkirController.rajaOngkirProvinsi);
router.get('/city/:id', rajaOngkirController.rajaOngkirCity);
router.post('/cost', rajaOngkirController.rajaOngkirCost);

module.exports = router;
