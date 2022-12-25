const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const userController = require('../controllers/user');

const passport = require('passport');

router
  .route('/register')
  .get(userController.renderRegister)
  .post(catchAsync(userController.register));

router
  .route('/login')
  .get(userController.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
      failureMessage: true,
      keepSessionInfo: true,
    }),
    userController.login
  );

router.get('/logout', userController.logout);

module.exports = router;
