// src/routes/movies.js
const express = require('express');
const router = express.Router();
const { getPopularMovies } = require('../controllers/movieController');

router.get('/popular', getPopularMovies);

module.exports = router;
