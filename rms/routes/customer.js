var express = require('express')
var router = express.Router()
var customer_controller = require('../controllers/customer')

router.get('/hello',customer_controller.hello);
router.get('/menu',customer_controller.get_menu);
router.get('/menu/:id',customer_controller.show_item_get);
router.post('/menu/:id',customer_controller.show_item_post);



module.exports = router;