const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    category: {
        type: String, enum: ["Personal Care",
            "Medication",
            "Daily Living",
            "Mobility",
            "Nutrition",
            "Communication",
            "Social",
            "Health Monitoring",
            "Safety Check",
            "Documentation"], required: true
    },
    task: { type: String },
    priority: { type: String, enum: ["routine", "important", "essential"] },
    skills: [String],
    equipment: [String],
    instructions: [String],
    documentation: [String],
});

const visitSchema = new mongoose.Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number },
    assignedCarer: { type: String },
    status: { type: String, enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'missed'], default: 'scheduled' },
    priority: { type: String, enum: ['routine', 'urgent', 'emergency'], default: 'routine' },
    notes: { type: String },
    tasks: [taskSchema],
});

const visitScheduleSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    visits: [visitSchema],
});

const VisitSchedule = mongoose.model('VisitSchedule', visitScheduleSchema);

module.exports = { VisitSchedule };

