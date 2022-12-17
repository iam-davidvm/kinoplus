const mongoose = require('mongoose');
const Cinema = require('../models/cinema');
const Movie = require('../models/movie');
const {
  names,
  locations,
  descriptions,
  emails,
  phones,
  owners,
  images,
} = require('./cinemaHelpers');
const { movies } = require('./moviehelpers');

mongoose
  .connect('mongodb://localhost:27017/kinoplus')
  .then(() => {
    console.log('MONGODB CONNECTED');
  })
  .catch((e) => {
    console.log('WE HAVE AN ERROR:');
    console.log(e);
  });

mongoose.set('strictQuery', false);

const seedDb = async () => {
  await Cinema.deleteMany({});
  await Movie.deleteMany({});

  for (let i = 0; i < 10; i++) {
    const cinema = new Cinema({
      name: names[i],
      location: locations[i],
      description: descriptions[i],
      image: images[i],
      owner: owners[i],
      email: emails[i],
      phone: phones[i],
    });
    await cinema.save();

    const cinemaId = cinema._id;
    /* randomMovies per Cinema, min 3 max 5 */
    const randomMovies = Math.floor(2 + Math.random() * 3);
    // Deep copy the array
    const availableMovies = [...movies];
    for (let i = 0; i < randomMovies; i++) {
      const randomMovie = Math.floor(Math.random() * availableMovies.length);
      const movie = new Movie({
        title: availableMovies[randomMovie].title,
        genre: availableMovies[randomMovie].genre,
        duration: availableMovies[randomMovie].duration,
        image: availableMovies[randomMovie].image,
        cinema: cinemaId,
      });
      availableMovies.splice(randomMovie, 1);
      await movie.save();
    }
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
