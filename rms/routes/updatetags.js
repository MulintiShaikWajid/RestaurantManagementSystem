var express = require('express');
var router = express.Router();
var updatetags = require('../controllers/updatetags');

router.get('/',updatetags.get_page);

router.post('/delete', updatetags.delete_item);

router.get('/newitem',updatetags.new_item);
router.post('/newitem',updatetags.additem);

router.get('/:id',updatetags.get_item);
router.post('/:id',updatetags.update_item);

module.exports = router;