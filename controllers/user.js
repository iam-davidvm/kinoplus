const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('user/register', { pageTitle: 'Create an account' });
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
  res.render('user/login', { pageTitle: 'Log in' });
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectURL = req.session.returnTo || '/kino';

  delete req.session.returnTo;
  res.redirect(redirectURL);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are logged out.');
    res.redirect('/kino');
  });
};
