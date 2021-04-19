var express = require('express');
var router = express.Router();
var updatestaff = require('../controllers/updatestaff');

router.get('/',updatestaff.get_page);

module.exports = router;