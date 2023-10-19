const express = require('express');
const controller = require('./auth.controller');
const middlewares = require('./auth.middlewares');
const schemas = require('./auth.schemas');

const router = express.Router();

// routes
router.get('/checkuser', controller.checkUser);

router.post(
  '/signup',
  middlewares.validateSchema(schemas.signup),
  middlewares.findUser(false),
  controller.signup,
);

router.post(
  '/login',
  middlewares.validateSchema(schemas.login),
  middlewares.findUser(true),
  controller.login,
);

// export
module.exports = router;
