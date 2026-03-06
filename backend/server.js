require('dotenv').config();

const express = require('express');
const cors = require('cors');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Security: limit request body size
app.use(express.json({ limit: '1mb' }));

// CORS configuration — ALLOWED_ORIGINS must be set in production
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : (process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000'),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Contact Sync API is running' });
});

// API routes
app.use('/contacts', contactRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Contact Sync server running at http://localhost:${port}`);
});