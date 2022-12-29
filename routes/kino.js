const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema');
const TempCinema = require('../models/tempCinema');
const Movie = require('../models/movie');
const Review = require('../models/review');
const User = require('../models/user');
const kinoController = require('../controllers/kino');
const catchAsync = require('../utils/catchAsync');
const {
  isLoggedIn,
  isCinemaAdmin,
  isReviewAuthor,
} = require('../utils/middleware');
const {
  validateCinema,
  validateMovie,
  validateReview,
} = require('../utils/middleware');
const { date } = require('joi');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(kinoController.renderCinemas));

router
  .route('/new')
  .get(isLoggedIn, kinoController.renderCinemaForm)
  .post(
    isLoggedIn,
    upload.single('image'),
    validateCinema,
    catchAsync(kinoController.addCinema)
  );

router
  .route('/:id')
  .get(catchAsync(kinoController.renderCinema))
  .patch(
    isLoggedIn,
    isCinemaAdmin,
    upload.single('image'),
    validateCinema,
    catchAsync(kinoController.editCinema)
  )
  .delete(isLoggedIn, isCinemaAdmin, catchAsync(kinoController.deleteCinema));

router.get(
  '/:id/edit',
  isLoggedIn,
  isCinemaAdmin,
  catchAsync(kinoController.renderEditCinemaForm)
);

module.exports = router;
