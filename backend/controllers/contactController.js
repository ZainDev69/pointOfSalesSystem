const Contact = require("../models/contactModel");
const { validationResult } = require("express-validator");
const { Client } = require("../models/clientModel");
const ActivityLog = require("../models/activityLogModel");
const catchAsync = require('./../utils/catchAsync');



exports.getContactOptions = catchAsync(async (req, res, next) => {
    const options = {
        status: Contact.schema.path('status').enumValues,
        types: Contact.schema.path('contactType').enumValues,
    }
    res.status(200).json({
        status: 'Success',
        data: options
    });

});



// Get all contacts for a client
exports.getContacts = async (req, res, next) => {
    try {
        console.log("Getting contacts for client:", req.params.clientId);
        const contacts = await Contact.find({ client: req.params.clientId });
        res.json(contacts);
    } catch (err) {
        next(err);
    }
};




// Add a contact
exports.addContact = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const contact = new Contact({ ...req.body, client: req.params.clientId });
        await contact.save();
        // Log activity
        const client = await Client.findById(req.params.clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Contact added: ${contact.name}`,
                user: 'Admin',
            });
        }
        res.status(201).json(contact);
    } catch (err) {
        next(err);
    }
};

// Edit a contact
exports.editContact = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const contact = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        // Log activity
        const client = await Client.findById(contact.client);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Contact updated: ${contact.name}`,
                user: 'Admin',
            });
        }
        res.json(contact);
    } catch (err) {
        next(err);
    }
};

// Delete a contact
exports.deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.contactId);
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        // Log activity
        const client = await Client.findById(contact.client);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Contact deleted: ${contact.name}`,
                user: 'Admin',
            });
        }
        res.json({ message: "Contact deleted" });
    } catch (err) {
        next(err);
    }
};



