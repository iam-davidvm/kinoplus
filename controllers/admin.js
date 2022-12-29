const User = require('../models/user');
const Cinema = require('../models/cinema');
const TempCinema = require('../models/tempCinema');

const { cloudinary } = require('../cloudinary');

module.exports.renderAdminPage = (req, res) => {
  res.render('admin/admin', { pageTitle: 'Admin' });
};

module.exports.renderUsersOverview = async (req, res) => {
  const users = await User.find();
  res.render('admin/users', { users, pageTitle: 'Overview users' });
};

module.exports.renderUserRoles = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render('admin/user', {
    user,
    pageTitle: `Change roles ${user.username}`,
  });
};

module.exports.editUserRoles = async (req, res) => {
  const { id } = req.params;
  const { roles } = req.body;
  const user = await User.findById(id);
  user.roles = [];
  switch (typeof roles) {
    case 'undefined':
      break;
    case 'string':
      user.roles.push(roles);
      break;
    case 'object':
      user.roles.push(...roles);
      break;
    default:
      req.flash('error', 'Something went wrong');
      return res.redirect('/kino');
  }
  await user.save();
  res.redirect('/admin/users');
};

module.exports.flashDeleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  req.flash('userWarning', {
    message: 'Are you sure you want to delete:',
    username: user.username,
    id,
  });
  res.redirect('/admin/users');
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  // I have chosen to not delete reviews, movies, cinemas linked at the user for this moment
  await User.findByIdAndDelete(id);
  req.flash('success', 'You deleted the user');
  res.redirect('/admin/users');
};

module.exports.renderRequestsOverview = async (req, res) => {
  const cinemas = await TempCinema.find().populate('admin');
  res.render('admin/requests', { cinemas, pageTitle: 'Overview requests' });
};

module.exports.renderRequest = async (req, res) => {
  const { id } = req.params;
  const cinema = await TempCinema.findById(id).populate('admin');
  res.render('admin/request', {
    cinema,
    pageTitle: `Request of ${cinema.name}`,
  });
};

module.exports.approveRequest = async (req, res, next) => {
  const { id } = req.params;
  const newCinema = new Cinema({ ...req.body.cinema });
  if (req.body.image) {
    newCinema.image = {
      url: req.body.image.url,
      filename: req.body.image.filename,
    };
  }
  await newCinema.save();
  await TempCinema.findByIdAndDelete(id);
  const newId = newCinema._id;
  req.flash('success', 'This cinema has succesfully been approved');
  res.redirect(`/kino/${newId}`);
};

module.exports.flashDeleteRequest = async (req, res) => {
  const { id } = req.params;
  const cinema = await TempCinema.findById(id);
  req.flash('cinemaWarning', {
    message: 'Are you sure you want to delete:',
    cinemaname: cinema.name,
    id,
  });
  res.redirect('/admin/requests');
};

module.exports.deleteRequest = async (req, res) => {
  const { id } = req.params;
  const cinema = await TempCinema.findById(id);
  if (cinema.image) {
    await cloudinary.uploader.destroy(cinema.image.filename);
  }
  await TempCinema.findByIdAndDelete(id);
  req.flash('success', 'The request is deleted.');
  res.redirect('/admin/requests');
};
