const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    line1: String,
    line2: String,
    city: String,
    county: String,
    postcode: String,
    country: { type: String, default: "United Kingdom" },
}, { _id: false });

const contactSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    contactType: { type: String, enum: ["family", "friend", "neighbor", "other"], default: "family" },
    phone: String,
    alternativePhone: String,
    email: String,
    address: addressSchema,
    isRegularVisitor: { type: Boolean, default: false },
    visitFrequency: String,
    preferredContactTime: String,
    specialInstructions: String,
    consentToContact: { type: Boolean, default: false },
    canReceiveUpdates: { type: Boolean, default: false },
    canMakeDecisions: { type: Boolean, default: false },
    hasKeyAccess: { type: Boolean, default: false },
    notes: String,
    status: { type: String, enum: ["active", "inactive", "no-contact"], default: "active" },
    addedDate: { type: Date, default: Date.now },
    lastContactDate: Date,
});

module.exports = mongoose.model("Contact", contactSchema);