const express = require('express');
const router = express.Router();
const TempCinema = require('../models/tempCinema');
const Cinema = require('../models/cinema');
const catchAsync = require('../utils/catchAsync');
const { validateCinema } = require('../utils/middleware');

router.get(
  '/requests',
  catchAsync(async (req, res) => {
    const cinemas = await TempCinema.find();
    res.render('admin/requests', { cinemas });
  })
);

router.get(
  '/requests/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const cinema = await TempCinema.findById(id);
    res.render('admin/request', { cinema });
  })
);

router.post(
  '/requests/:id',
  validateCinema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const newCinema = new Cinema({ ...req.body.cinema });
    await newCinema.save();
    await TempCinema.findByIdAndDelete(id);
    const newId = newCinema._id;
    req.flash('success', 'This cinema has succesfully been approved');
    res.redirect(`/kino/${newId}`);
  })
);

router.delete(
  '/requests/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await TempCinema.findByIdAndDelete(id);
    req.flash('success', 'The request is deleted.');
    res.redirect('/admin/requests');
  })
);

module.exports = router;
