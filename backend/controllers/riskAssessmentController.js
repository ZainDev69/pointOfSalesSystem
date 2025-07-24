const RiskAssessment = require('../models/riskAssessmentModel');
const Client = require('../models/clientModel');
const ActivityLog = require('../models/activityLogModel');

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