var express = require('express');
var router = express.Router();
var editpersonaldetails = require('../controllers/editpersonaldetails');

router.get('/', editpersonaldetails.get_page);

module.exports = router;