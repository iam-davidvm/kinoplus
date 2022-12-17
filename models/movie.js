const mongoose = require('mongoose');
const { Schema } = mongoose;
const Cinema = require('./cinema');

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  duration: {
    string: Number,
    required: true,
  },
  cinema: {
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model('Movie', movieSchema);
