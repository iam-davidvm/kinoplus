const Joi = require('joi');

module.exports.cinemaSchema = Joi.object({
  cinema: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().max(192).required(),
    image: Joi.string(),
    owner: Joi.string(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  }).required,
});
