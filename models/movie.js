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
    enum: [
      'Action',
      'Adventure',
      'Animation',
      'Biography',
      'Comedy',
      'Crime',
      'Drama',
      'Fantasy',
      'Musical',
      'Mystery',
      'Romance',
      'Sci-Fi',
      'Thriller',
      'Western',
    ],
    required: true,
  },
  duration: {
    type: Number,
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
