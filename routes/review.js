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

router.get('/', isLoggedIn, (req, res) => {
  const { id } = req.params;
  res.render('review/new', { id, pageTitle: 'Add review' });
});

router.post(
  '/',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const cinema = await Cinema.findById(id);
    const review = new Review({
      ...req.body.review,
      date: Date.now(),
      author: req.user._id,
    });
    await review.save();
    cinema.reviews.push(review._id);
    await cinema.save();
    req.flash('success', 'Your review has been added.');
    res.redirect(`/kino/${id}`);
  })
);

router.get(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    res.render('review/edit', { review, id, pageTitle: 'Edit review' });
  })
);

router.patch(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  validateReview,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
    req.flash('success', 'Your review is saved.');
    res.redirect(`/kino/${id}`);
  })
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Cinema.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('Success', 'Successfully deleted this review');
    res.redirect(`/kino/${id}`);
  })
);

module.exports = router;
