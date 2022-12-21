const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

const cinemaSchema = new Schema({
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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

cinemaSchema.post('findOneAndDelete', async function (cinema) {
  if (cinema.reviews.length) {
    await Review.deleteMany({ _id: { $in: cinema.reviews } });
  }
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
