const ExpressError = require('./ExpressError');
const Cinema = require('../models/cinema');
const User = require('../models/user');
const Review = require('../models/review');
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

module.exports.isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user.roles.includes('admin')) {
    req.flash('error', 'You are not an admin');
    res.redirect('/kino');
  } else {
    next();
  }
};

module.exports.isCinemaAdmin = async (req, res, next) => {
  const { id } = req.params;
  const cinema = await Cinema.findById(id);
  const user = await User.findById(req.user._id);
  if (!cinema.admin.equals(req.user._id) && !user.roles.includes('admin')) {
    req.flash('error', 'You do not have permission');
    return res.redirect(`/kino/${id}`);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  const user = await User.findById(req.user._id);
  if (!review.author.equals(req.user._id) && !user.roles.includes('admin')) {
    req.flash('error', 'You do not have permission');
    res.redirect(`/kino/${id}`);
  } else {
    next();
  }
};
