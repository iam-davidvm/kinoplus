const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');

/* import routes */
const kinoRoutes = require('./routes/kino');

/* view settings */
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Needed to use the bulma framework
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/'));

/* use routes */
app.use('/kino', kinoRoutes);

app.use('/', (req, res) => {
  res.redirect('/kino');
});

app.listen(3000, () => {
  console.log('LISTENING TO PORT 3000');
});
