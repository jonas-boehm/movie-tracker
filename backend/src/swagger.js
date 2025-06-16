// src/swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger Definition
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MovieTracker API',
            version: '1.0.0',
            description: 'API-Dokumentation für das MovieTracker-Projekt',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
    },
    apis: [__dirname + '/routes/*.js'],
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs,
};
