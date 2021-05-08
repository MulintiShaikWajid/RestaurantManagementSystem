var express = require('express');
var router = express.Router();
var updateinventory = require('../controllers/updateinventory');

router.get('/',updateinventory.get_page);

router.post('/delete', updateinventory.delete_item);


router.get('/newitem',updateinventory.new_item);
router.post('/newitem',updateinventory.additem);

router.get('/:id',updateinventory.get_item);
router.post('/:id',updateinventory.update_item);


module.exports = router;