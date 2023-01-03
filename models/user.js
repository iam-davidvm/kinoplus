const mongoose = require('mongoose');
const Review = require('./review');
const Cinema = require('./cinema');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  roles: {
    type: [String],
  },
});

userSchema.plugin(passportLocalMongoose);

userSchema.post('save', function (err, doc, next) {
  if (
    error.name === 'MongoServerError' &&
    error.code === 11000 &&
    error.keyValue.email
  ) {
    next(new Error('A user with the given email is already registered'));
  } else {
    next(err);
  }
});

// delete the reviews
userSchema.post('findOneAndDelete', async function (user) {
  if (user) {
    // select all reviews from the user
    const allReviews = await Review.find({
      author: user._id,
    });

    for (let review of allReviews) {
      // delete the review in the cinema collection
      await Cinema.deleteMany({ reviews: { $elemMatch: { $eq: review._id } } });

      // delete specific review
      await Review.deleteOne({ author: user._id });
    }
  }
});

module.exports = mongoose.model('User', userSchema);
