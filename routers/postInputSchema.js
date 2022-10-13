'use strict';
const Joi = require('joi');

const schema = {
  post_schema: Joi.object({
    // regex for only allowing png, jpeg and jpg image types
    image: Joi.string().regex(/\.(png|jpg|jpe?g)$/i).required(),
    title: Joi.string().min(3).max(20).required(),
    description: Joi.string().min(10).max(3000).required(),
    tags: Joi.array()
  }),
  update_schema: Joi.object({
    id: Joi.string(),
    image: Joi.string().regex(/\.(png|jpg|jpe?g)$/i),
    title: Joi.string().min(3).max(20).when('id', {is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required()}),
    description: Joi.string().min(10).max(3000),
    tags: Joi.array()
  }).required(),
  delete_schema: Joi.object({
    id: Joi.string(),
    title: Joi.string().when('id', {is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required()})
  }).required(),
};


module.exports = schema;