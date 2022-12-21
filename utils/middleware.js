const ExpressError = require('./ExpressError');
const { cinemaSchema, movieSchema, reviewSchema } = require('../schemas');

module.exports.validateCinema = (req, res, next) => {
  const { error } = cinemaSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateMovie = (req, res, next) => {
  const { error } = movieSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

/* at this moment, you only return to the page if you have to be logged in */
/* maybe better to have two routes savePageURL an this on, with different goals */
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in!');
    return res.redirect('/login');
  }
  next();
};
