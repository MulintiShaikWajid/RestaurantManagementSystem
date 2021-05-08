var express = require('express');
var router = express.Router();
var headwaiterhello = require('../controllers/headwaiterhello');

router.get('/', headwaiterhello.get_page);
router.post('/nextorderstatus', headwaiterhello.next_order_status);
router.post('/accepttablerequest', headwaiterhello.accept_table_request);
router.post('/rejecttablerequest', headwaiterhello.reject_table_request);
router.post('/logout', headwaiterhello.logout);

module.exports = router;