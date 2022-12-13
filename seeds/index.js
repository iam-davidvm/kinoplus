const mongoose = require('mongoose');
const Cinema = require('../models/cinema');
const {
  names,
  locations,
  descriptions,
  emails,
  phones,
  owners,
  images,
} = require('./cinemaHelpers');

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

  /* better to use a for loop */
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
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
