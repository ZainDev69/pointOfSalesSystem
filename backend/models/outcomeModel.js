const mongoose = require('mongoose');

const outcomeSchema = new mongoose.Schema({
    carePlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarePlan',
        required: false
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    measurable: {
        type: String,
        required: true
    },
    achievable: {
        type: Boolean,
        default: true
    },
    timeframe: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['in-progress', 'achieved', 'unachieved', 'modified'],
        default: 'in-progress'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['personal-care', 'daily-living', 'mobility', 'nutrition', 'social', 'medical'],
        default: 'personal-care'
    },
    progress: [{
        date: {
            type: Date,
            default: Date.now
        },
        progress: String,
        evidence: String,
        nextSteps: [String],
        recordedBy: String,
        percentageComplete: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    }],
    notes: String,
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

// Indexes for efficient queries
outcomeSchema.index({ carePlanId: 1, status: 1 });
outcomeSchema.index({ clientId: 1, status: 1 });
outcomeSchema.index({ carePlanId: 1, category: 1 });

const Outcome = mongoose.model('Outcome', outcomeSchema);
module.exports = Outcome; 