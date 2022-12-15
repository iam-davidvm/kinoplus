const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema');
const TempCinema = require('../models/tempCinema');
const catchAsync = require('../utils/catchAsync');

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
    res.render('kino/show', { cinema });
  })
);

module.exports = router;
