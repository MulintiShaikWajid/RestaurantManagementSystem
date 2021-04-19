var express = require('express');
var router = express.Router();
var statistics = require('../controllers/statistics');

router.get('/',statistics.get_page);

module.exports = router;