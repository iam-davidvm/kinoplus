const mongoose = require('mongoose');
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

module.exports = mongoose.model('User', userSchema);
