const express = require('express');
const app = express();

/* import routes */
const kinoRoutes = require('./routes/kino');

/* use routes */
app.use('/kino', kinoRoutes);

app.use('/', (req, res) => {
  res.redirect('/kino');
});

app.listen(3000, () => {
  console.log('LISTENING TO PORT 3000');
});
