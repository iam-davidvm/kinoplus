const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('kino/index');
});

module.exports = router;
