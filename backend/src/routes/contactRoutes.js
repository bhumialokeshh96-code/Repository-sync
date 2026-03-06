'use strict';

const express = require('express');
const router = express.Router();
const { validateContactsUpload } = require('../middleware/validator');
const { uploadContactsHandler } = require('../controllers/contactController');

// POST /contacts/upload - Upload device contacts for a user
router.post('/upload', validateContactsUpload, uploadContactsHandler);

module.exports = router;