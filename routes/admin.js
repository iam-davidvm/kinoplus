const express = require('express');
const router = express.Router();
const TempCinema = require('../models/tempCinema');
const Cinema = require('../models/cinema');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { validateCinema, isLoggedIn, isAdmin } = require('../utils/middleware');

router.get('/', isLoggedIn, isAdmin, (req, res) => {
  res.render('admin/admin');
});

router.get(
  '/users',
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const users = await User.find();
    res.render('admin/users', { users });
  })
);

router.get(
  '/users/:id/delete',
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    req.flash('warning', {
      message: 'Are you sure you want to delete:',
      username: user.username,
      id,
    });
    res.redirect('/admin/users');
  })
);

router.delete(
  '/users/:id',
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // I have chosen to not delete reviews, movies, cinemas linked at the user for this moment
    await User.findByIdAndDelete(id);
    req.flash('success', 'You deleted the user');
    res.redirect('/admin/users');
  })
);

router.get(
  '/requests',
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const cinemas = await TempCinema.find().populate('admin');
    res.render('admin/requests', { cinemas });
  })
);

router.get(
  '/requests/:id',
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const cinema = await TempCinema.findById(id).populate('admin');
    res.render('admin/request', { cinema });
  })
);

router.post(
  '/requests/:id',
  isLoggedIn,
  isAdmin,
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
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await TempCinema.findByIdAndDelete(id);
    req.flash('success', 'The request is deleted.');
    res.redirect('/admin/requests');
  })
);

module.exports = router;
