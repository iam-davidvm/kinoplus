const Cinema = require('../models/cinema');
const TempCinema = require('../models/tempCinema');
const Movie = require('../models/movie');

const { cloudinary } = require('../cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

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
  // console.log(req.file);
  const geoData = await geocoder
    .forwardGeocode({
      query: cinema.location,
      limit: 1,
    })
    .send();
  cinema.geometry = geoData.body.features[0].geometry;
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
  const cinema = await Cinema.findById(id);
  const hasNewLocation = req.body.cinema.location !== cinema.location;
  await Cinema.findByIdAndUpdate(id, {
    ...req.body.cinema,
  });

  if (req.file) {
    if (cinema.image) {
      await cloudinary.uploader.destroy(cinema.image.filename);
    }

    cinema.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  if (hasNewLocation) {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.cinema.location,
        limit: 1,
      })
      .send();
    cinema.geometry = geoData.body.features[0].geometry;
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
