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
router.get('/edit',customer_controller.edit_get);
router.post('/name',customer_controller.name_post);
router.post('/username',customer_controller.username_post);
router.post('/password',customer_controller.password_post);
router.post('/street',customer_controller.street_post);
router.post('/hno',customer_controller.hno_post);
router.post('/city',customer_controller.city_post);
router.post('/state',customer_controller.state_post);
router.post('/country',customer_controller.country_post);
router.post('/pin',customer_controller.pin_post);
router.post('/phone/add',customer_controller.add_phone_post);
router.post('/phone/:number',customer_controller.phone_post);
module.exports = router;