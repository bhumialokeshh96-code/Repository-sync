'use strict';

const express = require('express');
const router = express.Router();

// GET contact form
router.get('/contact', (req, res) => {
    res.send('Contact form');
});

// POST contact form
router.post('/contact', (req, res) => {
    // Process contact form data
    const { name, email, message } = req.body;
    // Here you would typically handle the data, e.g., save to database or send email
    res.send(`Thank you for contacting us, ${name}.`);
});

module.exports = router;