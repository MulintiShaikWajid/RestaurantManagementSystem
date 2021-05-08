var express = require('express');
var router = express.Router();
var editpersonaldetails = require('../controllers/editpersonaldetails');

router.post('/', editpersonaldetails.get_page);
router.post('/update', editpersonaldetails.update_details);

module.exports = router;