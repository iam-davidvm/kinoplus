const Cinema = require('../models/cinema');
const TempCinema = require('../models/tempCinema');
const Movie = require('../models/movie');

const { cloudinary } = require('../cloudinary');

module.exports.renderCinemas = async (req, res) => {
  const cinemas = await Cinema.find({}).populate('reviews');
  res.render('kino/index', { cinemas, pageTitle: 'Cinemas' });
};

module.exports.renderCinemaForm = (req, res) => {
  res.render('kino/new', { pageTitle: 'Add Cinema' });
};

module.exports.addCinema = async (req, res, next) => {
  const cinema = new TempCinema({
    ...req.body.cinema,
    admin: req.user._id,
    // image,
  });
  if (req.file) {
    cinema.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  console.log(req.file);
  await cinema.save();
  req.flash('success', 'Succesfully requested to add a cinema!');
  res.redirect(`/kino`);
};

module.exports.renderCinema = async (req, res) => {
  const { id } = req.params;
  const cinema = await Cinema.findById(id).populate({
    path: 'reviews',
    populate: { path: 'author' },
  });
  const movies = await Movie.find({ cinema: id });
  res.render('kino/show', { cinema, movies, pageTitle: cinema.name });
};

module.exports.renderEditCinemaForm = async (req, res) => {
  const { id } = req.params;
  const cinema = await Cinema.findById(id);
  res.render('kino/edit', { cinema, pageTitle: `Edit ${cinema.name}` });
};

module.exports.editCinema = async (req, res, next) => {
  const { id } = req.params;
  await Cinema.findByIdAndUpdate(id, { ...req.body.cinema });
  const cinema = await Cinema.findById(id);
  console.log(req.file);

  if (req.file) {
    if (cinema.image) {
      await cloudinary.uploader.destroy(cinema.image.filename);
    }

    cinema.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  await cinema.save();
  res.redirect(`/kino/${id}`);
};

module.exports.deleteCinema = async (req, res) => {
  const { id } = req.params;
  const cinema = await Cinema.findById(id);

  if (cinema.image) {
    await cloudinary.uploader.destroy(cinema.image.filename);
  }
  await Cinema.findByIdAndDelete(id);
  await Movie.deleteMany({ cinema: cinema._id });
  req.flash('success', `Succesfully deleted ${cinema.name}.`);
  res.redirect('/kino');
};
