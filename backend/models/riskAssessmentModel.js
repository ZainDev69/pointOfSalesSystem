const mongoose = require('mongoose');

const RiskSchema = new mongoose.Schema({
    hazard: String,
    whoAtRisk: [String],
    likelihood: String,
    severity: String,
    riskLevel: String,
    existingControls: [String],
    residualRisk: String,
});

const ControlMeasureSchema = new mongoose.Schema({
    riskId: String,
    measure: String,
    type: String,
    responsibility: String,
    implementationDate: String,
    reviewDate: String,
    status: String,
    effectiveness: String,
});

const MonitoringPlanSchema = new mongoose.Schema({
    frequency: String,
    methods: [String],
    indicators: [String],
    responsibility: String,
    reportingProcess: [String],
});

const RiskAssessmentSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    type: { type: String, required: true },
    assessmentDate: { type: String, required: true },
    assessedBy: { type: String, required: true },
    reviewDate: { type: String, required: true },
    status: { type: String, default: 'current' },
    overallRisk: { type: String, default: 'low' },
    risks: [RiskSchema],
    controlMeasures: [ControlMeasureSchema],
    monitoringPlan: MonitoringPlanSchema,
    version: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('RiskAssessment', RiskAssessmentSchema); 