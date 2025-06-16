const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const genreMap = {
    'Action': 28,
    'Adventure': 12,
    'Animation': 16,
    'Comedy': 35,
    'Crime': 80,
    'Documentary': 99,
    'Drama': 18,
    'Family': 10751,
    'Fantasy': 14,
    'History': 36,
    'Horror': 27,
    'Music': 10402,
    'Mystery': 9648,
    'Romance': 10749,
    'Science Fiction': 878,
    'TV Movie': 10770,
    'Thriller': 53,
    'War': 10752,
    'Western': 37
};

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Endpunkte für Filme 
 */

/**
 * @swagger
 * /movies/popular:
 *   get:
 *     summary: Gibt eine Liste beliebter Filme zurück
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Seitenzahl für die Paginierung
 *     responses:
 *       200:
 *         description: Erfolgreich abgerufen
 */
router.get('/popular', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=de&page=${page}`);
        const data = await tmdbRes.json();
        res.json(data.results);
    } catch (err) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Filme' });
    }
});

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Sucht nach Filmen anhand eines Titels
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Der Suchbegriff (z. B. Filmtitel)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Seitenzahl für die Paginierung
 *     responses:
 *       200:
 *         description: Erfolgreich abgerufen
 *       400:
 *         description: Suchbegriff fehlt
 */
router.get('/search', async (req, res) => {
    const query = req.query.query;
    const page = req.query.page || 1;

    if (!query) {
        return res.status(400).json({ message: 'Suchbegriff fehlt' });
    }

    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=de&page=${page}`;
        const tmdbRes = await fetch(url);
        const data = await tmdbRes.json();

        const sorted = data.results.sort((a, b) =>
            (b.vote_average * b.vote_count) - (a.vote_average * a.vote_count)
        );

        res.json(sorted);
    } catch (err) {
        res.status(500).json({ message: 'Fehler bei der Filmsuche' });
    }
});

/**
 * @swagger
 * /movies/filter:
 *   get:
 *     summary: Gibt Filme basierend auf Filtern zurück (Genre, Jahr, Bewertung)
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Genre-Name wie "Action" oder "Comedy"
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Erscheinungsjahr des Films
 *       - in: query
 *         name: rating
 *         schema:
 *           type: string
 *         description: Bewertung (z. B. "none", "all", oder eine Zahl wie "7")
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Seitenzahl für die Paginierung
 *     responses:
 *       200:
 *         description: Erfolgreich abgerufen
 */
router.get('/filter', async (req, res) => {
    const { genre, year, rating } = req.query;
    const page = req.query.page || 1;

    const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'de',
        sort_by: 'popularity.desc',
        include_adult: 'false',
        include_video: 'false',
        'vote_count.gte': '300',
        page
    });

    if (genre && genreMap[genre]) {
        params.append('with_genres', genreMap[genre]);
    }

    if (year) {
        params.append('primary_release_year', year);
    }

    try {
        const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
        const tmdbRes = await fetch(url);
        const data = await tmdbRes.json();

        let results = data.results;

        if (rating && rating !== 'all') {
            if (rating === 'none') {
                results = results.filter(m => !m.vote_average);
            } else {
                results = results.filter(m => m.vote_average >= +rating);
            }
        }

        results.sort((a, b) =>
            (b.vote_average * b.vote_count) - (a.vote_average * a.vote_count)
        );

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Fehler bei der gefilterten Suche' });
    }
});

module.exports = router;