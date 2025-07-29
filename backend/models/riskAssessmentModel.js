const mongoose = require('mongoose');

const RiskSchema = new mongoose.Schema({
    hazard: String,
    whoAtRisk: [String],
    likelihood: {
        type: String,
        enum: [
            'very-unlikely',
            'unlikely',
            'possible',
            'likely',
            'very-likely'
        ],
        required: true
    },
    severity: {
        type: String,
        enum: [
            'negligible',
            'minor',
            'moderate',
            'major',
            'catastrophic'
        ],
        required: true
    },
});

const RiskAssessmentSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    type: {
        type: String,
        enum: [
            "allergies",
            "continence",
            "eating and drinking",
            "falls",
            "fire",
            "health",
            "medications",
            "mobility,moving & handling",
            "outings",
            "pets",
            "property & premises",
            "skin care",
            "sleep",
            "washing and bathing",
            "waste disposal",
            "other/general",
        ],
        required: true
    },
    assessmentDate: { type: String, required: true },
    assessedBy: { type: String, required: true },
    reviewDate: { type: String, required: true },
    status: {
        type: String,
        enum: [
            'draft',
            'current',
            'reviewed',
            'archived',
            'expired'
        ],
        default: 'current'
    },
    risks: [RiskSchema],
    version: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('RiskAssessment', RiskAssessmentSchema); 