var express = require('express');
var router = express.Router();
var login_controller = require('../controllers/login');

router.get('/',login_controller.login_get);

router.post('/',login_controller.login_post);


module.exports = router;