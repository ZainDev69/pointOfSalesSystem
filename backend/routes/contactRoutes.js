const express = require("express");
const router = express.Router({ mergeParams: true });
const contactController = require("../controllers/contactController");
const { contactValidation } = require("../validators/contactValidator");

// GET all contacts for a client
router.get("/:clientId/contacts", contactController.getContacts);

// POST add a contact
router.post("/:clientId/contacts", contactValidation, contactController.addContact);

// PUT edit a contact
router.put("/:clientId/contacts/:contactId", contactValidation, contactController.editContact);

// DELETE a contact
router.delete("/:clientId/contacts/:contactId", contactController.deleteContact);

module.exports = router;