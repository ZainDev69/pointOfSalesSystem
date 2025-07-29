const CarePlan = require('../models/carePlanModel');
const Outcome = require('../models/outcomeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Client } = require('../models/clientModel');
const ActivityLog = require('../models/activityLogModel');

// Get all care plans for a client
exports.getClientCarePlans = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;

    const carePlans = await CarePlan.find({ clientId })
        .sort({ version: -1 })
        .select('-__v');

    res.status(200).json({
        status: 'Success',
        results: carePlans.length,
        data: carePlans
    });
});

// Get specific care plan
exports.getCarePlan = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const carePlan = await CarePlan.findById(id);
    if (!carePlan) {
        return next(new AppError('No care plan found with that ID', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: carePlan
    });
});

// Get active care plan for a client
exports.getActiveCarePlan = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;

    const activeCarePlan = await CarePlan.findOne({
        clientId,
        status: 'active'
    }).sort({ version: -1 });

    if (!activeCarePlan) {
        return res.status(200).json({
            status: 'Success',
            data: null,
            message: 'No active care plan found'
        });
    }

    res.status(200).json({
        status: 'Success',
        data: activeCarePlan
    });
});

// Create new care plan
exports.createCarePlan = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;

    // Check if there's an existing active care plan
    const existingActivePlan = await CarePlan.findOne({
        clientId,
        status: 'active'
    });

    // If there's an active plan, archive it
    if (existingActivePlan) {
        await CarePlan.findByIdAndUpdate(existingActivePlan._id, {
            status: 'expired'
        });
    }

    // Get the next version number
    const latestVersion = await CarePlan.findOne({ clientId })
        .sort({ version: -1 })
        .select('version');

    const newVersion = latestVersion ? latestVersion.version + 1 : 1;

    const carePlanData = {
        ...req.body,
        clientId,
        version: newVersion,
        status: 'active'
    };

    const newCarePlan = await CarePlan.create(carePlanData);

    // Log activity
    const client = await Client.findById(clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Care plan added',
            user: 'Admin',
        });
    }

    res.status(201).json({
        status: 'Success',
        data: {
            carePlan: newCarePlan
        }
    });
});

// Update care plan (creates new version)
exports.updateCarePlan = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { clientId } = req.body;

    // Get the current care plan
    const currentCarePlan = await CarePlan.findById(id);
    if (!currentCarePlan) {
        return next(new AppError('No care plan found with that ID', 404));
    }

    // Get all outcomes from the current care plan
    const existingOutcomes = await Outcome.find({ carePlanId: id });

    // Archive the current plan
    await CarePlan.findByIdAndUpdate(id, { status: 'expired' });

    // Get the next version number
    const latestVersion = await CarePlan.findOne({ clientId })
        .sort({ version: -1 })
        .select('version');

    const newVersion = latestVersion ? latestVersion.version + 1 : 1;

    // Create new version
    const carePlanData = {
        ...req.body,
        clientId,
        version: newVersion,
        status: 'active',
        reviewDate: new Date(), // Always set to now on update
    };

    const updatedCarePlan = await CarePlan.create(carePlanData);

    // Copy all outcomes to the new care plan
    if (existingOutcomes.length > 0) {
        const outcomeCopies = existingOutcomes.map(outcome => ({
            ...outcome.toObject(),
            _id: undefined, // Remove the old _id so MongoDB creates a new one
            carePlanId: updatedCarePlan._id,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        await Outcome.insertMany(outcomeCopies);
    }

    // Log activity
    const client = await Client.findById(clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Care plan updated',
            user: 'Admin',
        });
    }

    res.status(200).json({
        status: 'Success',
        data: {
            carePlan: updatedCarePlan
        }
    });
});

// Delete care plan
exports.deleteCarePlan = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const carePlan = await CarePlan.findByIdAndDelete(id);
    if (!carePlan) {
        return next(new AppError('No care plan found with that ID', 404));
    }

    // Also delete associated outcomes
    await Outcome.deleteMany({ carePlanId: id });

    // Log activity
    const client = await Client.findById(carePlan.clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Care plan deleted',
            user: 'Admin',
        });
    }

    res.status(204).json({
        status: 'Success',
        data: null
    });
});

// Get care plan history
exports.getCarePlanHistory = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;

    const carePlans = await CarePlan.find({ clientId })
        .sort({ version: -1 })
        .select('version status assessmentDate assessedBy reviewDate createdAt approvedBy')
        .limit(20);

    res.status(200).json({
        status: 'Success',
        results: carePlans.length,
        data: carePlans
    });
});

// Get outcomes for a care plan
exports.getCarePlanOutcomes = catchAsync(async (req, res, next) => {
    const { carePlanId } = req.params;
    console.log('Fetching outcomes for care plan:', carePlanId);

    const outcomes = await Outcome.find({ carePlanId })
        .sort({ createdAt: -1 });

    console.log('Found outcomes:', outcomes.length);

    res.status(200).json({
        status: 'Success',
        results: outcomes.length,
        data: outcomes
    });
});

// Create outcome
exports.createOutcome = catchAsync(async (req, res, next) => {
    const { carePlanId } = req.params;
    console.log('Creating outcome for care plan:', carePlanId);
    console.log('Request body:', req.body);

    // Get the care plan to get the clientId
    const carePlan = await CarePlan.findById(carePlanId);
    if (!carePlan) {
        console.log('Care plan not found with ID:', carePlanId);
        return next(new AppError('No care plan found with that ID', 404));
    }

    const outcomeData = {
        ...req.body,
        carePlanId,
        clientId: carePlan.clientId
    };
    console.log('Outcome data to create:', outcomeData);

    try {
        const newOutcome = await Outcome.create(outcomeData);
        console.log('Outcome created successfully:', newOutcome._id);
        return newOutcome;
    } catch (error) {
        console.error('Error creating outcome:', error);
        throw error;
    }

    // Log activity
    const client = await Client.findById(carePlan.clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Outcome added',
            user: 'Admin',
        });
    }

    res.status(201).json({
        status: 'Success',
        data: {
            outcome: newOutcome
        }
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
    const client = await Client.findById(outcome.clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Outcome updated',
            user: 'Admin',
        });
    }

    res.status(200).json({
        status: 'Success',
        data: {
            outcome
        }
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
    const client = await Client.findById(outcome.clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Outcome deleted',
            user: 'Admin',
        });
    }

    res.status(204).json({
        status: 'Success',
        data: null
    });
});

// Restore care plan (make it active)
exports.restoreCarePlan = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { clientId } = req.body;

    // Find the care plan to restore
    const carePlanToRestore = await CarePlan.findById(id);
    if (!carePlanToRestore) {
        return next(new AppError('No care plan found with that ID', 404));
    }

    // Check if it belongs to the client
    if (carePlanToRestore.clientId.toString() !== clientId) {
        return next(new AppError('Care plan does not belong to this client', 403));
    }

    // Deactivate current active care plan
    await CarePlan.updateMany(
        { clientId, status: 'active' },
        { status: 'expired' }
    );

    // Get the latest version number
    const latestVersion = await CarePlan.findOne({ clientId })
        .sort({ version: -1 })
        .select('version');

    const newVersion = latestVersion ? latestVersion.version + 1 : 1;

    // Create a new version based on the restored care plan
    const restoredCarePlanData = {
        ...carePlanToRestore.toObject(),
        _id: undefined, // Remove the original _id
        version: newVersion,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const restoredCarePlan = await CarePlan.create(restoredCarePlanData);

    // Log activity
    const client = await Client.findById(clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Care plan restored from version ' + carePlanToRestore.version,
            user: 'Admin',
        });
    }

    res.status(200).json({
        status: 'Success',
        data: restoredCarePlan
    });
});





