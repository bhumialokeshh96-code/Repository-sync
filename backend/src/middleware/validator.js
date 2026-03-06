// validator.js - Joi input validation middleware for contacts upload

const Joi = require('joi');

const contactsUploadSchema = Joi.object({
    userId: Joi.string().trim().min(1).max(255).required(),
    contacts: Joi.array()
        .items(
            Joi.object({
                phone: Joi.string()
                    .pattern(/^\d{10}$/)
                    .required()
                    .messages({
                        'string.pattern.base': 'Each phone number must be exactly 10 digits',
                    }),
            })
        )
        .min(1)
        .required(),
});

const validateContactsUpload = (req, res, next) => {
    const { error } = contactsUploadSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.details.map((d) => d.message),
        });
    }
    next();
};

module.exports = { validateContactsUpload };