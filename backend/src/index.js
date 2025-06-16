const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// 🔌 WebSocket initialisieren
const { setupWebSocket } = require('./websocket');
setupWebSocket(server);

// 🛣️ API-Routen importieren
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const ratingRoutes = require('./routes/ratings');

// 📚 Swagger-Dokumentation
const { swaggerUi, specs } = require('./swagger');

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// ✅ API-Endpunkte
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/ratings', ratingRoutes);

// ✅ Swagger-UI (muss vor Fallback stehen)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ✅ Statische Angular-Dateien
app.use(express.static(path.join(__dirname, '../public')));

// ❗ Angular-Fallback nur für "Nicht-API"-Routen
app.get(/^\/(?!api|api-docs).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 🔥 Server starten
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
    console.log(`📚 Swagger verfügbar unter http://localhost:${PORT}/api-docs`);
});
