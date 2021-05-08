var express = require('express')
var router = express.Router()
var customer_controller = require('../controllers/customer')

router.get('/hello',customer_controller.hello);
router.get('/menu',customer_controller.get_menu);
router.get('/menu/:id/:code?',customer_controller.show_item_get);
router.post('/menu/:id',customer_controller.show_item_post);
router.get('/cart',customer_controller.show_cart_get);
router.post('/cart',customer_controller.show_cart_post);
router.get('/prevcart',customer_controller.show_previous_orders);
router.get('/order/:id',customer_controller.show_order);
router.post('/rate/:itemid/:orderid',customer_controller.rate_post);
router.post('/review/:itemid/:orderid',customer_controller.review_post);
router.get('/notifications',customer_controller.show_notifications);
router.get('/book',customer_controller.book_table_get);
router.post('/book',customer_controller.book_table_post);
router.get('/error/:code',customer_controller.show_error_get);
router.get('/prevtable',customer_controller.show_prevtable_get);
router.get('/logout',customer_controller.logout);
router.get('/create',customer_controller.create_get);
router.post('/create',customer_controller.create_post);
module.exports = router;