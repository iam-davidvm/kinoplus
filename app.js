const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const mongoose = require('mongoose');

/* import routes */
const kinoRoutes = require('./routes/kino');

/* view settings */
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Needed to use the bulma framework
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/'));

/* Connecting to mongo */
mongoose
  .connect('mongodb://localhost:27017/kinoplus')
  .then(() => {
    console.log('CONNECTED TO MONGODB');
  })
  .catch((e) => {
    console.log('AN ERROR OCCURED:');
    console.log(e);
  });
mongoose.set('strictQuery', false);

/* use routes */
app.use('/kino', kinoRoutes);

app.use('/', (req, res) => {
  res.redirect('/kino');
});

app.listen(3000, () => {
  console.log('LISTENING TO PORT 3000');
});
