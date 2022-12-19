const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema');
const TempCinema = require('../models/tempCinema');
const Movie = require('../models/movie');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {
  validateCinema,
  validateMovie,
  validateReview,
} = require('../utils/middleware');
const { date } = require('joi');
const review = require('../models/review');

router.get(
  '/',
  catchAsync(async (req, res) => {
    const cinemas = await Cinema.find({}).populate('reviews');
    res.render('kino/index', { cinemas });
  })
);

router.get('/new', (req, res) => {
  res.render('kino/new');
});

router.post(
  '/new',
  validateCinema,
  catchAsync(async (req, res) => {
    const cinema = new TempCinema(req.body.cinema);
    await cinema.save();
    req.flash('success', 'Succesfully requested to add a cinema!');
    res.redirect(`/kino`);
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const cinema = await Cinema.findById(id).populate('reviews');
    const movies = await Movie.find({ cinema: id });
    res.render('kino/show', { cinema, movies });
  })
);

router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const cinema = await Cinema.findById(id);
    res.render('kino/edit', { cinema });
  })
);

router.patch(
  '/:id',
  validateCinema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body.cinema);
    await Cinema.findByIdAndUpdate(id, { ...req.body.cinema });
    res.redirect(`/kino/${id}`);
  })
);

router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const cinema = await Cinema.findById(id);
    await Cinema.findByIdAndDelete(id);
    await Movie.deleteMany({ cinema: cinema._id });
    req.flash('success', `Succesfully deleted ${cinema.name}.`);
    res.redirect('/kino');
  })
);

router.get('/:id/movie', (req, res) => {
  const { id } = req.params;
  res.render('movie/new', { cinemaId: id });
});

router.post(
  '/:cinemaId/movie',
  validateMovie,
  catchAsync(async (req, res) => {
    const { cinemaId } = req.params;
    const cinema = await Cinema.findById(cinemaId);
    const movie = new Movie({
      ...req.body.movie,
      cinema: cinema._id,
    });
    // console.log(cinema._id);
    // movie.cinema = cinemaId;
    await movie.save();
    req.flash('success', 'The movie was succesfully added!');
    res.redirect(`/kino/${cinemaId}/`);
  })
);

router.get(
  '/:cinemaId/movie/:movieId',
  catchAsync(async (req, res) => {
    const { cinemaId, movieId } = req.params;
    await Movie.findByIdAndDelete(movieId);
    req.flash('success', 'The movie is deleted');
    res.redirect(`/kino/${cinemaId}`);
  })
);

router.get('/:id/review', (req, res) => {
  const { id } = req.params;
  res.render('review/new', { cinemaId: id });
});

router.post(
  '/:cinemaId/review',
  catchAsync(async (req, res) => {
    const { cinemaId } = req.params;
    const cinema = await Cinema.findById(cinemaId);
    const review = new Review({
      ...req.body.review,
      date: Date.now(),
    });
    await review.save();
    cinema.reviews.push(review._id);
    await cinema.save();
    req.flash('success', 'Your review has been added.');
    res.redirect(`/kino/${cinemaId}`);
  })
);

router.get(
  '/:cinemaId/review/:reviewId',
  catchAsync(async (req, res) => {
    const { cinemaId, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    res.render('review/edit', { review, cinemaId });
  })
);

router.patch(
  '/:cinemaId/review/:reviewId',
  validateReview,
  catchAsync(async (req, res) => {
    const { cinemaId, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, { ...req.body.review });
    req.flash('success', 'Your review is saved.');
    res.redirect(`/kino/${cinemaId}`);
  })
);

router.delete(
  '/:cinemaId/review/:reviewId',
  catchAsync(async (req, res) => {
    const { cinemaId, reviewId } = req.params;
    await Cinema.findByIdAndUpdate(cinemaId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('Success', 'Successfully deleted this review');
    res.redirect(`/kino/${cinemaId}`);
  })
);

module.exports = router;
