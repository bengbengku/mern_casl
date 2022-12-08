const router = require('express').Router();
const rajaOngkirController = require('./controller');

router.get('/province', rajaOngkirController.rajaOngkirProvinsi);
router.get('/city/:id', rajaOngkirController.rajaOngkirCity);

module.exports = router;
