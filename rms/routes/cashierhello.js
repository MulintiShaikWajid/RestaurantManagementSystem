var express = require('express');
var router = express.Router();
var cashierhello = require('../controllers/cashierhello');

router.get('/', cashierhello.get_page);
router.post('/', cashierhello.post_page);

module.exports = router;