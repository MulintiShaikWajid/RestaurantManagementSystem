var express = require('express');
var router = express.Router();
var updatedetails = require('../controllers/updatedetails');

router.get('/',updatedetails.get_page);

module.exports = router;