var express = require('express');
var router = express.Router();
var managerhello = require('../controllers/managerhello');

router.get('/',managerhello.hello_get);
//logout is using post of cashier in .pug

module.exports = router;