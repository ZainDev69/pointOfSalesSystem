const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    date: { type: Date, default: Date.now },
    action: { type: String, required: true },
    user: { type: String, default: 'System' },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema); 