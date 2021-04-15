const path = require('path');
const express = require('express');

const signup = require('../controllers/signup');

const router = express.Router();

router.get('/',signup.get_page);
router.post('/',signup.add_user);

module.exports = router;