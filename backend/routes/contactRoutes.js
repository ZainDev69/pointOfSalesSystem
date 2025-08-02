const express = require("express");
const router = express.Router({ mergeParams: true });
const contactController = require("../controllers/contactController");
const { contactValidation } = require("../validators/contactValidator");


router.get('/contactOptions', contactController.getContactOptions);

router.get("/", contactController.getContacts);

router.post("/", contactValidation, contactController.addContact);


router.put("/:contactId", contactValidation, contactController.editContact);

router.delete("/:contactId", contactController.deleteContact);



module.exports = router;