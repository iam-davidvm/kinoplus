const Movie = require('../models/movie');
const Cinema = require('../models/cinema');

module.exports.renderNewMovieForm = (req, res) => {
  const { id } = req.params;
  res.render('movie/new', { id, pageTitle: 'Add movie' });
};

module.exports.addNewMovie = async (req, res) => {
  const { id } = req.params;
  const cinema = await Cinema.findById(id);
  const movie = new Movie({
    ...req.body.movie,
    cinema: cinema._id,
  });
  await movie.save();
  req.flash('success', 'The movie was succesfully added!');
  res.redirect(`/kino/${id}/`);
};

module.exports.deleteMovie = async (req, res) => {
  const { id, movieId } = req.params;
  await Movie.findByIdAndDelete(movieId);
  req.flash('success', 'The movie is deleted');
  res.redirect(`/kino/${id}`);
};
