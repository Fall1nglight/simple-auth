const express = require('express');
const controller = require('./auth.controller');

const router = express.Router();

// routes
router.post('/signup', controller.signup);
router.post('/login', controller.login);

// export
module.exports = router;