if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const User = require('./models/user');

/* import routes */
const kinoRoutes = require('./routes/kino');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/review');

// MongoDB session store for Connect and Express
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL;

/* Connecting to mongo */
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('CONNECTED TO MONGODB');
  })
  .catch((e) => {
    console.log('AN ERROR OCCURED:');
    console.log(e);
  });
mongoose.set('strictQuery', false);

/* view settings */
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Needed to use the bulma framework
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/'));

/* work with form data */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// security
app.use(mongoSanitize());

// app.use(helmet());

const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://res.cloudinary.com/dtwyfmgxt/',
  'https://images.unsplash.com/',
];
const styleSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://res.cloudinary.com/dtwyfmgxt/',
];
const connectSrcUrls = [
  'https://*.tiles.mapbox.com',
  'https://api.mapbox.com',
  'https://events.mapbox.com',
  'https://res.cloudinary.com/dtwyfmgxt/',
];
const fontSrcUrls = ['https://res.cloudinary.com/dtwyfmgxt/'];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/dtwyfmgxt/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://cdn.cinematerial.com/',
        'https://images.unsplash.com/',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
      mediaSrc: ['https://res.cloudinary.com/dtwyfmgxt/'],
      childSrc: ['blob:'],
    },
  })
);

// storing the session in a mongodb
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  },
});

/* for flashing messages */
// we need sessions
const sessionConfig = {
  store,
  secret: process.env.SECRET,
  name: 'session',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'strict',
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

/* user authentication */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* end of user authentication */

/* setting up local variables */
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // res.locals.pageTitle = req.pageTitle;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.cinemaWarning = req.flash('cinemaWarning');
  res.locals.userWarning = req.flash('userWarning');

  next();
});

/* use routes */
app.use('/', userRoutes);
app.use('/kino', kinoRoutes);
app.use('/kino/:id/movie', movieRoutes);
app.use('/kino/:id/review', reviewRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.redirect('/kino');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page nog found!', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('LISTENING TO PORT 3000');
});
