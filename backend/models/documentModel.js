const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    type: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: String,
    tags: [String],
    status: { type: String, enum: ['draft', 'final', 'archived'], default: 'draft' },
    reviewRequired: { type: Boolean, default: false },
    reviewDate: String,
    version: { type: Number, default: 1 },
    createdDate: { type: String },
    createdBy: { type: String },
    lastModified: { type: String },
    modifiedBy: { type: String },
    attachments: [String],
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema); 