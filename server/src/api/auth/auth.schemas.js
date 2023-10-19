const Joi = require('joi');

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(32).required(),
});

module.exports = { login, signup: login };
