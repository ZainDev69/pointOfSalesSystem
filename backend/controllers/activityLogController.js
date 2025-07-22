const ActivityLog = require('../models/activityLogModel');

// Create a new activity log
exports.createActivityLog = async (req, res, next) => {
    try {
        const log = await ActivityLog.create(req.body);
        res.status(201).json({ status: 'Success', data: log });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
};

// Get all activity logs for a client
exports.getActivityLogsByClient = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const logs = await ActivityLog.find({ client: clientId }).sort({ date: -1 });
        res.status(200).json({ status: 'Success', data: logs });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
};

// Delete an activity log
exports.deleteActivityLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        await ActivityLog.findByIdAndDelete(id);
        res.status(204).json({ status: 'Success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
};

// Optionally: update an activity log
exports.updateActivityLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const log = await ActivityLog.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ status: 'Success', data: log });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
}; 