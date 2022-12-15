const mongoose = require('mongoose');
const { Schema } = mongoose;

const tempCinemaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: String,
  owner: String,
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const TempCinema = mongoose.model('TempCinema', tempCinemaSchema);

module.exports = TempCinema;
