const mongoose = require('mongoose');

const visitTypeSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    requiredTasks: [
        {
            task: { type: String, required: true },
            notes: { type: String, trim: true, default: '' }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
visitTypeSchema.index({ clientId: 1, isActive: 1 });
visitTypeSchema.index({ clientId: 1, createdAt: -1 });

const VisitType = mongoose.model('VisitType', visitTypeSchema);
module.exports = VisitType; 