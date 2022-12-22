const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const {
  isLoggedIn,
  isCinemaAdmin,
  validateMovie,
} = require('../utils/middleware');

const Cinema = require('../models/cinema');
const Movie = require('../models/movie');

router.get('/', isLoggedIn, isCinemaAdmin, (req, res) => {
  const { id } = req.params;
  res.render('movie/new', { id, pageTitle: 'Add movie' });
});

router.post(
  '/',
  isLoggedIn,
  isCinemaAdmin,
  validateMovie,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const cinema = await Cinema.findById(id);
    const movie = new Movie({
      ...req.body.movie,
      cinema: cinema._id,
    });
    await movie.save();
    req.flash('success', 'The movie was succesfully added!');
    res.redirect(`/kino/${id}/`);
  })
);

router.get(
  '/:movieId',
  isLoggedIn,
  isCinemaAdmin,
  catchAsync(async (req, res) => {
    const { id, movieId } = req.params;
    await Movie.findByIdAndDelete(movieId);
    req.flash('success', 'The movie is deleted');
    res.redirect(`/kino/${id}`);
  })
);

module.exports = router;
