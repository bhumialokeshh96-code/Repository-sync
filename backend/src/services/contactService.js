// contactService.js

// Mock contact list
const contacts = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

/**
 * Function to get all contacts
 */
const getAllContacts = () => {
    return contacts;
};

/**
 * Function to get a contact by ID
 * @param {number} id - ID of the contact
 */
const getContactById = (id) => {
    return contacts.find(contact => contact.id === id);
};

/**
 * Function to add a new contact
 * @param {string} name - Name of the contact
 * @param {string} email - Email of the contact
 */
const addContact = (name, email) => {
    const newContact = { id: contacts.length + 1, name, email };
    contacts.push(newContact);
    return newContact;
};

/**
 * Function to update a contact
 * @param {number} id - ID of the contact to update
 * @param {string} name - New name for the contact
 * @param {string} email - New email for the contact
 */
const updateContact = (id, name, email) => {
    const contact = getContactById(id);
    if (contact) {
        contact.name = name;
        contact.email = email;
    }
    return contact;
};

/**
 * Function to delete a contact
 * @param {number} id - ID of the contact to delete
 */
const deleteContact = (id) => {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        return contacts.splice(index, 1);
    }
    return null;
};

module.exports = { getAllContacts, getContactById, addContact, updateContact, deleteContact };