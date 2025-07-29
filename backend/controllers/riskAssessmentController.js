const RiskAssessment = require('../models/riskAssessmentModel');
const { Client } = require('../models/clientModel');
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
        console.log('=== CREATE RISK ASSESSMENT CONTROLLER CALLED ===');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);

        const assessment = await RiskAssessment.create(req.body);

        console.log('Assessment created successfully:', assessment);

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
        console.error('=== ERROR IN CREATE RISK ASSESSMENT ===');
        console.error('Error object:', err);
        console.error('Error message:', err.message);
        console.error('Error name:', err.name);
        if (err.errors) {
            console.error('Validation errors:', err.errors);
        }
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
        console.log("=== DELETE RISK ASSESSMENT CONTROLLER CALLED ===");
        console.log("Method:", req.method);
        console.log("URL:", req.originalUrl);
        console.log("Assessment ID:", id);
        console.log("Headers:", req.headers);

        const assessment = await RiskAssessment.findById(id);

        if (!assessment) {
            console.log("No assessment found with ID:", id);
            return res.status(404).json({ success: false, message: 'Risk assessment not found' });
        }

        console.log("Assessment found:", assessment);

        // Log activity before deleting
        if (assessment) {
            const client = await Client.findById(assessment.clientId);
            if (client) {
                await ActivityLog.create({
                    client: client._id,
                    action: `Risk Assessment deleted: ${assessment.type} ${assessment.assessmentDate}`,
                    user: 'Admin',
                });
                console.log("Activity logged for client:", client._id);
            }
        }

        await RiskAssessment.findByIdAndDelete(id);
        console.log("Assessment deleted successfully");

        res.status(204).json({ success: true });
    } catch (err) {
        console.error("Error in deleteRiskAssessment:", err);
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

// Get assessment status options
exports.getAssessmentStatusOptions = (req, res) => {
    const statusValues = getEnumValues(RiskAssessment.schema, 'status');
    const options = createOptions(statusValues);
    res.status(200).json({ status: 'Success', data: options });
}; 