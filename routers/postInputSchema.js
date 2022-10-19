const Joi = require('joi');

const schema = {
  postSchema: Joi.object({
    // regex for only allowing png, jpeg and jpg image types
    image: Joi.string(),
    title: Joi.string().min(3).max(20).required(),
    description: Joi.string().min(10).max(3000).required(),
    tags: Joi.array(),
  }),
  updateSchema: Joi.object({
    id: Joi.string().required(),
    image: Joi.string(),
    title: Joi.string().min(3).max(20),
    description: Joi.string().min(10).max(3000),
    tags: Joi.array(),
  }),
  deleteSchema: Joi.object({
    id: Joi.string().required(),
  }),
  getSchema: Joi.object({
    title: Joi.string(),
    user: Joi.string(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    tags: Joi.string(),
  }),
};

module.exports = schema;
