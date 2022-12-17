const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema');
const TempCinema = require('../models/tempCinema');
const Movie = require('../models/movie');
const catchAsync = require('../utils/catchAsync');
const { validateCinema, validateMovie } = require('../utils/middleware');

router.get(
  '/',
  catchAsync(async (req, res) => {
    const cinemas = await Cinema.find({});
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
    const cinema = await Cinema.findById(id);
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
    req.flash('success', `Succesfully deleted ${cinema.name}.`);
    res.redirect('/kino');
  })
);

module.exports = router;
