// src/controllers/movieController.js
const axios = require('axios');

exports.getPopularMovies = async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: 'de-DE'
            }
        });
        res.json(response.data.results);
    } catch (err) {
        res.status(500).json({ error: 'TMDB-Fehler' });
    }
};
