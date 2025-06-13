// src/websocket.js
const WebSocket = require('ws');
const clients = new Set();

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        clients.add(ws);
        ws.on('close', () => clients.delete(ws));
    });
}

function broadcastRatingUpdate(movieId, avg, count) {
    const message = JSON.stringify({
        type: 'ratingUpdate',
        movieId,
        average: avg,
        count
    });

    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}

module.exports = {
    setupWebSocket,
    broadcastRatingUpdate
};
