var express = require('express');
var router = express.Router();
var updateinventory = require('../controllers/updateinventory');

router.get('/',updateinventory.get_page);
router.post('/',updateinventory.update_inven);

module.exports = router;