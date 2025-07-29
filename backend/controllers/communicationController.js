const Communication = require('../models/communicationModel');
const ActivityLog = require('../models/activityLogModel');

// Create a new communication
exports.createCommunication = async (req, res, next) => {
    try {
        const comm = await Communication.create(req.body);
        // Log activity
        await ActivityLog.create({
            client: comm.client,
            action: `Communication created: ${comm.subject}`,
            user: req.body.initiatorName,
        });
        res.status(201).json({ status: 'Success', data: comm });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
};

// Get all communications for a client (with filter, type, pagination)
exports.getCommunicationsByClient = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const { type, category, page = 1, limit = 10 } = req.query;
        const query = { client: clientId };
        if (type) query.communicationType = type;
        if (category) query.category = category;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Communication.countDocuments(query);
        const comms = await Communication.find(query)
            .sort({ date: -1, time: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        res.status(200).json({
            status: 'Success',
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            results: comms.length,
            data: comms,
        });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
};

// Get a single communication
exports.getCommunication = async (req, res, next) => {
    try {
        const comm = await Communication.findById(req.params.id);
        res.status(200).json({ status: 'Success', data: comm });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
};

// Update a communication
exports.updateCommunication = async (req, res, next) => {
    try {
        const comm = await Communication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // Log activity
        await ActivityLog.create({
            client: comm.client,
            action: `Communication updated: ${comm.subject}`,
            user: req.body.initiatorName || 'Unknown',
        });
        res.status(200).json({ status: 'Success', data: comm });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
};

// Delete a communication
exports.deleteCommunication = async (req, res, next) => {
    try {
        const comm = await Communication.findByIdAndDelete(req.params.id);
        // Log activity
        if (comm) {
            await ActivityLog.create({
                client: comm.client,
                action: `Communication deleted: ${comm.subject}`,
                user: comm.initiatorName || 'Unknown',
            });
        }
        res.status(204).json({ status: 'Success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'Fail', message: err.message });
    }
};




exports.getInitiatedByEnum = (req, res) => {
    const initiatedBy = Communication.schema.path('initiatedBy').enumValues;
    res.status(200).json({ status: 'Success', data: initiatedBy });
};

exports.getCommunicationTypeEnum = (req, res) => {
    const communicationType = Communication.schema.path('communicationType').enumValues;
    res.status(200).json({ status: 'Success', data: communicationType });
};

exports.getCategoryEnum = (req, res) => {
    const category = Communication.schema.path('category').enumValues;
    res.status(200).json({ status: 'Success', data: category });
};

exports.getStatusEnum = (req, res) => {
    const status = Communication.schema.path('status').enumValues;
    res.status(200).json({ status: 'Success', data: status });
}; 