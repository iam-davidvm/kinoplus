const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema');

router.get('/', async (req, res) => {
  const cinemas = await Cinema.find({});
  res.render('kino/index', { cinemas });
});

module.exports = router;
