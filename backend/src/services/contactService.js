// contactService.js - Business logic for uploading contacts to MySQL

const pool = require('../config/database');

/**
 * Upload a batch of contacts for a user.
 * Deduplicates both within the batch and against existing DB records.
 * Uses INSERT IGNORE to skip duplicate (user_id, phone) pairs.
 *
 * @param {string} userId
 * @param {Array<{phone: string}>} contacts
 * @returns {Promise<{savedCount: number}>}
 */
const uploadContacts = async (userId, contacts) => {
    // Deduplicate within the incoming batch
    const uniquePhones = [...new Set(contacts.map((c) => c.phone))];

    if (uniquePhones.length === 0) {
        return { savedCount: 0 };
    }

    let savedCount = 0;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Use individual parameterized INSERT IGNORE statements to avoid
        // building dynamic SQL with variable numbers of placeholders.
        for (const phone of uniquePhones) {
            const [result] = await connection.execute(
                'INSERT IGNORE INTO contacts (user_id, phone) VALUES (?, ?)',
                [userId, phone]
            );
            savedCount += result.affectedRows;
        }
        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }

    return { savedCount };
};

module.exports = { uploadContacts };