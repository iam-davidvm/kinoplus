const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    // min: '2022-12-17', // disable this when you seed
    required: true,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
