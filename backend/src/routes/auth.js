const express = require('express');
const router = express.Router();
const pool = require('../db'); // Verbindung zu PostgreSQL

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpunkte für Login/Registrierung
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registriert einen neuen Benutzer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrierung erfolgreich
 *       400:
 *         description: Benutzer existiert bereits
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const exists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (exists.rows.length > 0) {
            return res.status(400).json({ message: 'Benutzer existiert bereits' });
        }
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
        res.status(201).json({ message: 'Erfolgreich registriert' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Fehler beim Registrieren' });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Meldet einen Benutzer an
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login erfolgreich
 *       401:
 *         description: Ungültige Anmeldedaten
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }
        res.status(200).json({ message: 'Login erfolgreich' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Fehler beim Login' });
    }
});

module.exports = router;
