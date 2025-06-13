const express = require('express');
const router = express.Router();
const pool = require('../db'); // Verbindung zu PostgreSQL

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
