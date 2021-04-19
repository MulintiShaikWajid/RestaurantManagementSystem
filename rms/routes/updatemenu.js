var express = require('express');
var router = express.Router();
var updatemenu = require('../controllers/updatemenu');

router.get('/',updatemenu.get_page);
router.post('/',updatemenu.update_menu);

module.exports = router;