var express = require('express');
var router = express.Router();

var controller = require('../controllers/apiController');

router.all('/country', controller.getCountries);
router.all('/city', controller.getCity);

module.exports = router;