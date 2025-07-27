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
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Build query with filters
        const query = { client: clientId };

        // Date filter - filter by specific date
        if (req.query.date) {
            const filterDate = new Date(req.query.date);
            const nextDate = new Date(filterDate);
            nextDate.setDate(nextDate.getDate() + 1);

            query.date = {
                $gte: filterDate,
                $lt: nextDate
            };
        }

        // User filter
        if (req.query.user) {
            query.user = { $regex: req.query.user, $options: 'i' };
        }

        const total = await ActivityLog.countDocuments(query);
        const logs = await ActivityLog.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            status: 'Success',
            total,
            page,
            pages: Math.ceil(total / limit),
            results: logs.length,
            data: logs
        });
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