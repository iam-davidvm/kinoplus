if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const Cinema = require('../models/cinema');
const TempCinema = require('../models/tempCinema');
const Movie = require('../models/movie');
const Review = require('../models/review');
const User = require('../models/user');
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
const { reviews } = require('./reviewHelpers');
const { users } = require('./userHelpers');

// mapbox geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({
  accessToken: mapBoxToken,
});

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
  await TempCinema.deleteMany({});
  await Movie.deleteMany({});
  await Review.deleteMany({});

  for (let i = 0; i < 10; i++) {
    const cinema = new Cinema({
      name: names[i],
      location: locations[i],
      description: descriptions[i],
      image: images[i],
      owner: owners[i],
      email: emails[i],
      phone: phones[i],
      admin: '63a233ea84d3c9ac50bd21b6', // cinema
    });
    /* randomMovies per Cinema, min 3 max 5 */
    const randomNum = Math.floor(2 + Math.random() * 3);

    const availableReviews = [...reviews];
    for (let i = 0; i < randomNum; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 14));
      const randomReview = Math.floor(Math.random() * availableReviews.length);
      const review = new Review({
        body: availableReviews[i].body,
        rating: availableReviews[i].rating,
        author: '63a233eb84d3c9ac50bd21bc', // dummy
        date,
      });
      await review.save();
      availableReviews.splice(randomReview, 1);
      cinema.reviews.push(review._id);
    }

    // adding geocode
    const geoData = await geocoder
      .forwardGeocode({
        query: locations[i],
        limit: 1,
      })
      .send();

    cinema.geometry = geoData.body.features[0].geometry;

    await cinema.save();

    const cinemaId = cinema._id;
    // Deep copy the array
    const availableMovies = [...movies];
    for (let i = 0; i < randomNum; i++) {
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
  // enable if new users are wanted
  /*
  for (let user of users) {
    const newUser = new User({
      username: user.username,
      email: user.email,
      roles: user.roles,
    });
    await User.register(newUser, user.password);
  }
  */
};

seedDb().then(() => {
  mongoose.connection.close();
});
