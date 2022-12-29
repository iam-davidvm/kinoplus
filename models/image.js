const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/ar_4:3,w_500,h_375,q_50,c_fill');
});

ImageSchema.virtual('hero').get(function () {
  return this.url.replace('/upload', '/upload/ar_3:1,w_1320,h_440,q_70,c_fill');
});

module.exports = ImageSchema;
