const BaseJoi = require('joi');

// security
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.cinemaSchema = Joi.object({
  cinema: Joi.object({
    name: Joi.string().escapeHTML().required(),
    location: Joi.string().escapeHTML().required(),
    description: Joi.string().escapeHTML().max(192).required(),
    // image: Joi.string(),
    owner: Joi.string().escapeHTML(),
    email: Joi.string().escapeHTML().email().required(),
    phone: Joi.string().escapeHTML().required(),
    admin: Joi.string().escapeHTML(),
  }).required(),
});

module.exports.movieSchema = Joi.object({
  movie: Joi.object({
    title: Joi.string().escapeHTML().required(),
    genre: Joi.string()
      .escapeHTML()
      .valid(
        'Action',
        'Adventure',
        'Animation',
        'Biography',
        'Comedy',
        'Crime',
        'Drama',
        'Fantasy',
        'Musical',
        'Mysterie',
        'Romance',
        'Sci-Fi',
        'Thriller',
        'Western'
      )
      .required(),
    duration: Joi.number().min(5).required(),
    image: Joi.string().escapeHTML(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().escapeHTML().required(),
    rating: Joi.number().min(1).max(5).required(),
    author: Joi.string().escapeHTML().required(),
  }).required(),
});
