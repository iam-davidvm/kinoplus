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

const movieController = require('../controllers/movie');

router
  .route('/')
  .get(isLoggedIn, isCinemaAdmin, movieController.renderNewMovieForm)
  .post(
    isLoggedIn,
    isCinemaAdmin,
    validateMovie,
    catchAsync(movieController.addNewMovie)
  );

router.get(
  '/:movieId',
  isLoggedIn,
  isCinemaAdmin,
  catchAsync(movieController.deleteMovie)
);

module.exports = router;
