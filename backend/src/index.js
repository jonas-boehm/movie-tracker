require('dotenv').config();
const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// 🟢 Statische Dateien für Angular
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));
