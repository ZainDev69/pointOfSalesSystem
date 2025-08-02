const Outcome = require('../models/outcomeModel');
const Client = require('../models/clientModel');
const ActivityLog = require('../models/activityLogModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all outcomes
exports.getAllOutcomes = catchAsync(async (req, res, next) => {
    const outcomes = await Outcome.find().sort({ createdAt: -1 });
    res.status(200).json({
        status: 'Success',
        results: outcomes.length,
        data: outcomes
    });
});

// Get outcome by ID
exports.getOutcomeById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const outcome = await Outcome.findById(id);
    if (!outcome) {
        return next(new AppError('No outcome found with that ID', 404));
    }
    res.status(200).json({
        status: 'Success',
        data: outcome
    });
});

// Get outcomes by client
exports.getOutcomesByClient = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;
    const outcomes = await Outcome.find({ clientId }).sort({ createdAt: -1 });
    res.status(200).json({
        status: 'Success',
        results: outcomes.length,
        data: outcomes
    });
});

// Create outcome (not tied to care plan)
exports.createOutcome = catchAsync(async (req, res, next) => {
    const outcomeData = { ...req.body };
    const newOutcome = await Outcome.create(outcomeData);
    if (newOutcome.clientId) {
        await ActivityLog.create({
            client: newOutcome.clientId,
            action: 'Outcome added',
            user: req.user?.name || 'System',
        });
    }
    res.status(201).json({
        status: 'Success',
        data: { outcome: newOutcome }
    });
});

// Update outcome
exports.updateOutcome = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const outcome = await Outcome.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!outcome) {
        return next(new AppError('No outcome found with that ID', 404));
    }

    // Log activity
    if (outcome.clientId) {
        await ActivityLog.create({
            client: outcome.clientId,
            action: 'Outcome updated',
            user: req.user?.name || 'System',
        });
    }

    res.status(200).json({
        status: 'Success',
        data: { outcome }
    });
});

// Delete outcome
exports.deleteOutcome = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const outcome = await Outcome.findByIdAndDelete(id);
    if (!outcome) {
        return next(new AppError('No outcome found with that ID', 404));
    }
    // Log activity
    if (outcome.clientId) {
        await ActivityLog.create({
            client: outcome.clientId,
            action: 'Outcome deleted',
            user: req.user?.name || 'System',
        });
    }
    res.status(204).json({
        status: 'Success',
        data: null
    });
});

// Add progress to outcome
exports.addOutcomeProgress = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const outcome = await Outcome.findById(id);
    if (!outcome) {
        return next(new AppError('No outcome found with that ID', 404));
    }
    outcome.progress.push(req.body);
    await outcome.save();
    res.status(200).json({
        status: 'Success',
        data: { outcome }
    });
});

// Get outcome options for select dropdowns
exports.getOutcomeOptions = catchAsync(async (req, res, next) => {
    const options = {
        status: Outcome.schema.path('status').enumValues,
        priority: Outcome.schema.path('priority').enumValues,
        category: Outcome.schema.path('category').enumValues
    };
    res.status(200).json({
        status: 'Success',
        data: options
    });
});

// Filter outcomes by multiple criteria (category, status, priority, clientId)
exports.filterOutcomes = catchAsync(async (req, res, next) => {
    const { category, status, priority, clientId } = req.query;
    const filterCriteria = {};
    if (category) filterCriteria.category = category;
    if (status) filterCriteria.status = status;
    if (priority) filterCriteria.priority = priority;
    if (clientId) filterCriteria.clientId = clientId;
    const outcomes = await Outcome.find(filterCriteria).sort({ createdAt: -1 });
    res.status(200).json({
        status: 'Success',
        results: outcomes.length,
        data: outcomes
    });
}); 