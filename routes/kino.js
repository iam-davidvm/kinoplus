const express = require('express');
const router = express.Router();
const Cinema = require('../models/cinema');

router.get('/', async (req, res) => {
  const cinemas = await Cinema.find({});
  res.render('kino/index', { cinemas });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const cinema = await Cinema.findById(id);
  res.render('kino/show', { cinema });
});

module.exports = router;
