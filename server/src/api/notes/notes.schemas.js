const Joi = require('joi');

const upload = Joi.object({
  title: Joi.string().min(3).max(32).required(),
  body: Joi.string().min(3).max(32).required(),
  public: Joi.boolean().required(),
});

const update = Joi.object({
  title: Joi.string().min(3).max(32),
  body: Joi.string().min(3).max(32),
  public: Joi.boolean(),
})
  .or('title', 'body', 'public')
  .required();

module.exports = { upload, update };
