const { VisitSchedule } = require('../models/visitScheduleModel');
const { Client } = require('../models/clientModel');
const ActivityLog = require('../models/activityLogModel');



exports.getVisitOptions = async (req, res, next) => {
    const options = {
        status: VisitSchedule.schema.path('visits.status').enumValues,
        priority: VisitSchedule.schema.path('visits.priority').enumValues,
        taskCategory: VisitSchedule.schema.path('visits.tasks.category').enumValues,
        taskPriority: VisitSchedule.schema.path('visits.tasks.priority').enumValues,
    };
    res.status(200).json({
        status: 'Success',
        data: options
    });
};

// Get all visits for a client
exports.getVisitSchedule = async (req, res) => {
    try {
        const { clientId } = req.params;
        let schedule = await VisitSchedule.findOne({ clientId });
        if (!schedule) {
            schedule = await VisitSchedule.create({ clientId, visits: [] });
        }
        res.status(200).json({ status: 'success', data: schedule });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a visit
exports.addVisit = async (req, res) => {
    try {
        const { clientId } = req.params;
        const visitData = req.body;
        let schedule = await VisitSchedule.findOne({ clientId });
        if (!schedule) {
            schedule = await VisitSchedule.create({ clientId, visits: [visitData] });
        } else {
            schedule.visits.push(visitData);
            await schedule.save();
        }
        // Log activity
        const client = await Client.findById(clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Visit scheduled: ${visitData.date} ${visitData.startTime}-${visitData.endTime}`,
                user: 'Admin',
            });
        }
        res.status(201).json({ status: 'success', data: { visits: schedule.visits } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a visit
exports.updateVisit = async (req, res) => {
    try {
        const { clientId, visitId } = req.params;
        const updateData = req.body;
        const schedule = await VisitSchedule.findOne({ clientId });
        if (!schedule) return res.status(404).json({ error: 'Visit schedule not found' });
        const visit = schedule.visits.id(visitId);
        if (!visit) return res.status(404).json({ error: 'Visit not found' });
        Object.assign(visit, updateData);
        await schedule.save();
        // Log activity
        const client = await Client.findById(clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Visit updated: ${updateData.date} ${updateData.startTime}-${updateData.endTime}`,
                user: 'Admin',
            });
        }
        res.status(200).json({ status: 'success', data: { visits: schedule.visits } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a visit
exports.deleteVisit = async (req, res) => {
    try {
        const { clientId, visitId } = req.params;
        const schedule = await VisitSchedule.findOne({ clientId });
        if (!schedule) return res.status(404).json({ error: 'Visit schedule not found' });
        const visit = schedule.visits.id(visitId);
        if (!visit) return res.status(404).json({ error: 'Visit not found' });
        // Log activity before removing
        const client = await Client.findById(clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Visit deleted: ${visit.date} ${visit.startTime}-${visit.endTime}`,
                user: 'Admin',
            });
        }
        schedule.visits.pull(visitId);
        await schedule.save();
        res.json({ message: "Visit deleted", visitId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



