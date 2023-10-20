const express = require('express');
const controller = require('./notes.controller');
const middlwares = require('./notes.middlewares');
const authMiddlewares = require('../auth/auth.middlewares');
const schemas = require('./notes.schemas');

const router = express.Router();

// routes
router.get('/', controller.getUserNotes); // retrieve the logged in user's notes

router.get('/all-public', controller.getAllPublic); // retrieve every public note

router.get('/all', authMiddlewares.isAdmin, controller.getAll);

router.get('/:id', authMiddlewares.isAdmin, controller.get);

router.post('/', middlwares.validateSchema(schemas.upload), controller.post);

router.patch(
  '/:id',
  middlwares.validateSchema(schemas.update),
  middlwares.matchUserId,
  controller.patch,
);

router.delete('/:id', middlwares.matchUserId, controller.del);

module.exports = router;
