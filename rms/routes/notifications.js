var express = require('express');
var router = express.Router();
var notifications = require('../controllers/notifications');

router.get('/',notifications.get_page);

module.exports = router;