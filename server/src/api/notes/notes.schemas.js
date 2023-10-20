const Joi = require('joi');

const upload = Joi.object({
  title: Joi.string().min(3).max(32).required(),
  body: Joi.string().min(3).max(32).required(),
  public: Joi.boolean().required(),
});

const update = Joi.object({
  title: Joi.string().min(3).max(32).required(),
  body: Joi.string().min(3).max(32).required(),
  public: Joi.boolean().required(),
}).or('title', 'body', 'public');

module.exports = { upload, update };
