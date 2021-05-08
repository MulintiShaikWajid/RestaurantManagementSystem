var express = require('express');
var router = express.Router();
var updatemenu = require('../controllers/updatemenu');

router.get('/',updatemenu.get_page);
// router.post('/',updatemenu.update_menu);

router.post('/delete', updatemenu.delete_item);

router.get('/newitem',updatemenu.new_item);
router.post('/newitem',updatemenu.additem);

router.get('/:id',updatemenu.get_item);
router.post('/:id',updatemenu.update_item);



module.exports = router;