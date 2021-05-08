var express = require('express');
var router = express.Router();
var cashierhello = require('../controllers/cashierhello');

router.get('/', cashierhello.get_page);
router.post('/', cashierhello.post_page);
router.post('/logout', cashierhello.logout);

module.exports = router;