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
    riskLevel: {
        type: String,
        enum: [
            'very-low',
            'low',
            'medium',
            'high',
            'very-high'
        ],
        required: true
    },
    existingControls: [String],
    residualRisk: String,
});

const ControlMeasureSchema = new mongoose.Schema({
    riskId: String,
    measure: String,
    type: {
        type: String,
        enum: [
            'elimination',
            'substitution',
            'engineering',
            'administrative',
            'ppe',
            'training',
            'monitoring',
            'emergency-response'
        ],
        required: true
    },
    responsibility: String,
    implementationDate: String,
    reviewDate: String,
    status: {
        type: String,
        enum: [
            'not-started',
            'in-progress',
            'completed',
            'on-hold',
            'cancelled'
        ],
        default: 'not-started'
    },
    effectiveness: {
        type: String,
        enum: [
            'not-effective',
            'partially-effective',
            'effective',
            'highly-effective'
        ],
        default: 'not-effective'
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
            "environmental",
            "moving-handling",
            "falls",
            "medication",
            "skin-integrity",
            "nutrition-hydration",
            "mental-capacity",
            "infection-control",
            "fire-safety",
            "personal-safety"
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
    overallRisk: {
        type: String,
        enum: [
            'very-low',
            'low',
            'medium',
            'high',
            'very-high'
        ],
        default: 'low'
    },
    risks: [RiskSchema],
    controlMeasures: [ControlMeasureSchema],
    version: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('RiskAssessment', RiskAssessmentSchema); 