var express = require('express');
var router = express.Router();
var managerhello = require('../controllers/managerhello');

router.get('/',managerhello.hello_get);
// router.post('/',hello_controller.logout)
module.exports = router;