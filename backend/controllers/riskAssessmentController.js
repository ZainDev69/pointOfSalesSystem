const RiskAssessment = require('../models/riskAssessmentModel');
const Client = require('../models/clientModel');
const ActivityLog = require('../models/activityLogModel');

// Helper function to get enum values from schema
const getEnumValues = (schema, path) => {
    return schema.path(path).enumValues || [];
};

// Helper function to create option objects
const createOptions = (values) => {
    return values.map((value, index) => ({
        value: value,
        label: value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        score: index + 1
    }));
};

// Create a new risk assessment
exports.createRiskAssessment = async (req, res) => {
    try {
        const assessment = await RiskAssessment.create(req.body);
        // Log activity
        const client = await Client.findById(assessment.clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Risk Assessment added: ${assessment.type} ${assessment.assessmentDate}`,
                user: 'Admin',
            });
        }
        res.status(201).json({ success: true, data: assessment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all risk assessments for a client
exports.getRiskAssessmentsByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const assessments = await RiskAssessment.find({ clientId });
        res.status(200).json({ success: true, data: assessments });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Update a risk assessment
exports.updateRiskAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await RiskAssessment.findByIdAndUpdate(id, req.body, { new: true });
        // Log activity
        const client = await Client.findById(updated.clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Risk Assessment updated: ${updated.type} ${updated.assessmentDate}`,
                user: 'Admin',
            });
        }
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete a risk assessment
exports.deleteRiskAssessment = async (req, res) => {
    try {
        const { id } = req.params;
        const assessment = await RiskAssessment.findById(id);
        // Log activity before deleting
        if (assessment) {
            const client = await Client.findById(assessment.clientId);
            if (client) {
                await ActivityLog.create({
                    client: client._id,
                    action: `Risk Assessment deleted: ${assessment.type} ${assessment.assessmentDate}`,
                    user: 'Admin',
                });
            }
        }
        await RiskAssessment.findByIdAndDelete(id);
        res.status(204).json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getRiskAssessmentTypes = (req, res) => {
    const types = getEnumValues(RiskAssessment.schema, 'type');
    const options = createOptions(types);
    res.status(200).json({ status: 'Success', data: options });
};

// Get likelihood options
exports.getLikelihoodOptions = (req, res) => {
    const likelihoodValues = getEnumValues(RiskAssessment.schema.path('risks').schema, 'likelihood');
    const options = createOptions(likelihoodValues);
    res.status(200).json({ status: 'Success', data: options });
};

// Get severity options
exports.getSeverityOptions = (req, res) => {
    const severityValues = getEnumValues(RiskAssessment.schema.path('risks').schema, 'severity');
    const options = createOptions(severityValues);
    res.status(200).json({ status: 'Success', data: options });
};

// Get risk level options
exports.getRiskLevelOptions = (req, res) => {
    const riskLevelValues = getEnumValues(RiskAssessment.schema.path('risks').schema, 'riskLevel');
    const options = createOptions(riskLevelValues);
    res.status(200).json({ status: 'Success', data: options });
};

// Get overall risk options
exports.getOverallRiskOptions = (req, res) => {
    const overallRiskValues = getEnumValues(RiskAssessment.schema, 'overallRisk');
    const options = createOptions(overallRiskValues);
    res.status(200).json({ status: 'Success', data: options });
};

// Get assessment status options
exports.getAssessmentStatusOptions = (req, res) => {
    const statusValues = getEnumValues(RiskAssessment.schema, 'status');
    const options = createOptions(statusValues);
    res.status(200).json({ status: 'Success', data: options });
};

// Get control measure type options
exports.getControlMeasureTypeOptions = (req, res) => {
    const typeValues = getEnumValues(RiskAssessment.schema.path('controlMeasures').schema, 'type');
    const options = createOptions(typeValues);
    res.status(200).json({ status: 'Success', data: options });
};

// Get control measure status options
exports.getControlMeasureStatusOptions = (req, res) => {
    const statusValues = getEnumValues(RiskAssessment.schema.path('controlMeasures').schema, 'status');
    const options = createOptions(statusValues);
    res.status(200).json({ status: 'Success', data: options });
};

// Get control measure effectiveness options
exports.getControlMeasureEffectivenessOptions = (req, res) => {
    const effectivenessValues = getEnumValues(RiskAssessment.schema.path('controlMeasures').schema, 'effectiveness');
    const options = createOptions(effectivenessValues);
    res.status(200).json({ status: 'Success', data: options });
}; 