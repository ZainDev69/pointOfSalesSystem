const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    communicationType: {
        type: String,
        enum: [
            'phone',
            'email',
            'video-call',
            'sms',
        ],
        required: true,
    },
    category: {
        type: String,
        enum: [
            'Administrative',
            'Appointment Related',
            'Care Plan Discussion',
            'Emergency',
            'General Inquiry',
            'Medication Related',
            'Service Feedback',
        ],
        required: true,
    },
    subject: { type: String, required: true },
    initiatedBy: { type: String, enum: ['client', 'staff', 'External Party', 'system'], required: true },
    initiatorName: { type: String, required: true },
    recipient: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String },
    outcome: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'Requires Follow-up', 'No Response Required'], default: 'open' },
    followUpDate: { type: Date },
    attachments: [{ type: String }], // store file URLs or paths
    urgent: { type: Boolean, default: false },
    confidential: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Communication', communicationSchema); 