// contactController.js - Request handlers for contacts upload

const { uploadContacts } = require('../services/contactService');

/**
 * POST /contacts/upload
 * Body: { userId: string, contacts: Array<{ phone: string }> }
 */
const uploadContactsHandler = async (req, res) => {
    try {
        const { userId, contacts } = req.body;
        const { savedCount } = await uploadContacts(userId, contacts);
        res.status(200).json({
            success: true,
            message: `${savedCount} contact(s) uploaded successfully`,
            count: savedCount,
        });
    } catch (error) {
        console.error('Error uploading contacts:', error);
        res.status(500).json({ error: 'Failed to upload contacts' });
    }
};

module.exports = { uploadContactsHandler };
