const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require('../utils/middleware');

const Cinema = require('../models/cinema');
const Review = require('../models/review');

const reviewController = require('../controllers/review');

router
  .route('/')
  .get(isLoggedIn, reviewController.renderNewReviewForm)
  .post(isLoggedIn, catchAsync(reviewController.addNewReview));

router
  .route('/:reviewId')
  .get(
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviewController.renderEditReviewForm)
  )
  .patch(
    isLoggedIn,
    isReviewAuthor,
    validateReview,
    catchAsync(reviewController.editMovie)
  )
  .delete(isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteMovie));

module.exports = router;
