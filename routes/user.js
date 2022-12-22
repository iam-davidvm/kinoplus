const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
  res.render('user/register', { pageTitle: 'Create an account' });
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password, isCinemaAuthor } = req.body;
      const user = new User({ email, username });
      if (isCinemaAuthor === 'true') {
        user.roles.push('cinemaAuthor');
      }
      const registeredUser = await User.register(user, password);

      req.login(registeredUser, (err) => {
        if (err) return next();
        req.flash('success', 'You succesfully registered');
        res.redirect('/kino');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/register');
    }
  })
);

router.get('/login', (req, res) => {
  res.render('user/login', { pageTitle: 'Log in' });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    failureMessage: true,
    keepSessionInfo: true,
  }),
  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = req.session.returnTo || '/kino';

    delete req.session.returnTo;
    res.redirect(redirectURL);
  }
);

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are logged out.');
    res.redirect('/kino');
  });
});

module.exports = router;
