const Review = require('../models/review');
const Cinema = require('../models/cinema');

module.exports.renderNewReviewForm = (req, res) => {
  const { id } = req.params;
  res.render('review/new', { id, pageTitle: 'Add review' });
};

module.exports.addNewReview = async (req, res) => {
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
};

module.exports.renderEditReviewForm = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  res.render('review/edit', { review, id, pageTitle: 'Edit review' });
};

module.exports.editMovie = async (req, res) => {
  const { id, reviewId } = req.params;
  console.log(req.user._id);
  await Review.findByIdAndUpdate(reviewId, {
    ...req.body.review,
  });
  req.flash('success', 'Your review is saved.');
  res.redirect(`/kino/${id}`);
};

module.exports.deleteMovie = async (req, res) => {
  const { id, reviewId } = req.params;
  await Cinema.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('Success', 'Successfully deleted this review');
  res.redirect(`/kino/${id}`);
};
