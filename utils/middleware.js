const ExpressError = require('./ExpressError');
const { cinemaSchema } = require('../schemas');

module.exports.validateCinema = (req, res, next) => {
  const { error } = cinemaSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
