const path = require('path');
const express = require('express');

const login = require('../controllers/login');

const router = express.Router();

router.get('/',login.get_page);
router.post('/',login.post_login);

module.exports = router;