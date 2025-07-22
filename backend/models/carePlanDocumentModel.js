const mongoose = require('mongoose');

const carePlanDocumentSchema = new mongoose.Schema({
    carePlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarePlan', required: true },
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