const { body, validationResult } = require('express-validator');

// Middleware for validating input data
const validateInput = [
    // Example validation rules
    body('username').isString().isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Custom validation error handler
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateInput;