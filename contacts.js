const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const result = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(result);

    return contacts;
  } catch (error) {
    throw new Error(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.filter(
      ({ id }) => String(id) === String(contactId)
    );

    return contact;
  } catch (error) {
    throw new Error(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const updatedContacts = contacts.filter(
      ({ id }) => String(id) !== String(contactId)
    );

    if (contacts.length === updatedContacts.length) {
      return null;
    }

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));

    return updatedContacts;
  } catch (error) {
    throw new Error(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();

    const newContact = { id: crypto.randomUUID(), name, email, phone };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
