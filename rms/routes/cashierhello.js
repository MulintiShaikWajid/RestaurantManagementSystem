var express = require('express');
var router = express.Router();
var cashierhello = require('../controllers/cashierhello');

router.get('/', cashierhello.get_page);
router.post('/onlinepayment', cashierhello.post_page);
router.post('/offlineorderpayment', cashierhello.offlineorderpayment);
router.post('/logout', cashierhello.logout);

module.exports = router;