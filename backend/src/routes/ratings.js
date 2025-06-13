// src/routes/ratings.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { broadcastRatingUpdate } = require('../websocket');

router.post('/rate', async (req, res) => {
    const { userId, movieId, rating } = req.body;

    if (!userId || !movieId || rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'Ungültige Bewertung' });
    }

    try {
        await pool.query(`
            INSERT INTO ratings (user_id, movie_id, rating)
            VALUES ($1, $2, $3)
                ON CONFLICT (user_id, movie_id)
            DO UPDATE SET rating = EXCLUDED.rating
        `, [userId, movieId, rating]);

        const result = await pool.query(`
            SELECT AVG(rating)::numeric(3,2) AS avg, COUNT(*) AS count
            FROM ratings
            WHERE movie_id = $1
        `, [movieId]);

        const { avg, count } = result.rows[0];

        broadcastRatingUpdate(movieId, avg, count); // Echtzeit-Update an alle Clients

        res.status(200).json({ average: avg, count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Fehler beim Bewerten' });
    }
});

module.exports = router;
