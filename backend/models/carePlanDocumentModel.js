const mongoose = require('mongoose');

const carePlanDocumentSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    carePlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarePlan', required: false },
    title: { type: String, required: true },
    attachments: [
        {
            url: { type: String, required: true },
            originalName: { type: String },
        }
    ],
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CarePlanDocument', carePlanDocumentSchema); 