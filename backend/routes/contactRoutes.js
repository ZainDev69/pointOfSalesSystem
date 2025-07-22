const express = require("express");
const router = express.Router({ mergeParams: true });
const contactController = require("../controllers/contactController");
const { contactValidation } = require("../validators/contactValidator");

// GET all contacts for a client
router.get("/", contactController.getContacts);

// POST add a contact
router.post("/", contactValidation, contactController.addContact);

// PUT edit a contact
router.put("/:contactId", contactValidation, contactController.editContact);

// DELETE a contact
router.delete("/:contactId", contactController.deleteContact);

module.exports = router;