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
  }).required(),
});

module.exports.movieSchema = Joi.object({
  movie: Joi.object({
    title: Joi.string().required(),
    genre: Joi.string().required(), // could enum here
    duration: Joi.number().min(5).required(),
    image: Joi.string(),
  }).required(),
});