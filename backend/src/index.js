// src/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const { setupWebSocket } = require('./websocket'); // NEU
setupWebSocket(server); // WebSocket initialisieren

const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const ratingRoutes = require('./routes/ratings');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/ratings', ratingRoutes);

app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Backend läuft auf Port ${PORT}`);
});
