const Joi = require('joi');

const schema = {
  registerSchema: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  loginSchema: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  schema,
};
