var express = require('express');
var router = express.Router();
var hello_controller = require('../controllers/hello');

router.get('/',hello_controller.hello_get);

module.exports = router;