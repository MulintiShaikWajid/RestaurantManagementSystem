var express = require('express');
var router = express.Router();
var updatestaff = require('../controllers/updatestaff');

router.get('/',updatestaff.get_page);

router.post('/delete', updatestaff.delete_item);


router.get('/newitem',updatestaff.new_item);
router.post('/newitem',updatestaff.additem);

router.get('/:id',updatestaff.get_item);
router.post('/:id',updatestaff.update_item);

module.exports = router;