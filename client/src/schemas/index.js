import Joi from 'joi';

const login = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).max(32).required()
});

const signup = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).max(32).required(),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password')
});

const upload = Joi.object({
  title: Joi.string().min(3).max(32).required(),
  body: Joi.string().min(3).max(32).required(),
  public: Joi.boolean().required()
});

const edit = Joi.object({
  title: Joi.string().min(3).max(32),
  body: Joi.string().min(3).max(32),
  public: Joi.boolean()
})
  .or('title', 'body', 'public')
  .required();

const schemas = {
  login,
  signup,
  upload,
  edit
};

export default schemas;
