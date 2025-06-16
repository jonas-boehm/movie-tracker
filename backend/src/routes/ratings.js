const express = require('express');
const router = express.Router();
const pool = require('../db');
const { broadcastRatingUpdate } = require('../websocket');

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Endpunkte zur Film-Bewertung
 */

/**
 * @swagger
 * /ratings/rate:
 *   post:
 *     summary: Bewertet einen Film
 *     tags: [Ratings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - movieId
 *               - rating
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               movieId:
 *                 type: integer
 *                 example: 123
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4
 *     responses:
 *       200:
 *         description: Bewertung erfolgreich gespeichert
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: number
 *                 count:
 *                   type: integer
 *       400:
 *         description: Ungültige Bewertung
 *       500:
 *         description: Interner Serverfehler
 */
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

        broadcastRatingUpdate(movieId, avg, count);
        res.status(200).json({ average: avg, count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Fehler beim Bewerten' });
    }
});

/**
 * @swagger
 * /ratings/{movieId}:
 *   get:
 *     summary: Gibt die durchschnittliche Bewertung eines Films zurück
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des Films
 *     responses:
 *       200:
 *         description: Bewertung gefunden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: number
 *                   example: 3.5
 *                 count:
 *                   type: integer
 *                   example: 7
 *       500:
 *         description: Fehler beim Abrufen der Bewertung
 */
router.get('/:movieId', async (req, res) => {
    const { movieId } = req.params;

    try {
        const result = await pool.query(`
            SELECT AVG(rating)::numeric(3,2) AS avg, COUNT(*) AS count
            FROM ratings
            WHERE movie_id = $1
        `, [movieId]);

        const { avg, count } = result.rows[0];
        res.json({ average: avg || 0, count: count || 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Fehler beim Abrufen der Bewertung' });
    }
});

module.exports = router;
