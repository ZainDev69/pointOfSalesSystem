const mongoose = require('mongoose');

const taskOptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
taskOptionSchema.index({ name: 1 });
taskOptionSchema.index({ isActive: 1 });

const TaskOption = mongoose.model('TaskOption', taskOptionSchema);
module.exports = TaskOption; 