const VisitType = require('../models/visitTypeModel');
const TaskOption = require('../models/taskOptionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Client } = require('../models/clientModel');
const ActivityLog = require('../models/activityLogModel');

// Get all visit types for a client
exports.getClientVisitTypes = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;

    const visitTypes = await VisitType.find({
        clientId,
        isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: visitTypes.length,
        data: {
            visitTypes
        }
    });
});

// Get a single visit type
exports.getVisitType = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const visitType = await VisitType.findById(id);

    if (!visitType) {
        return next(new AppError('Visit type not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            visitType
        }
    });
});

// Create a new visit type
exports.createVisitType = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;
    const { requiredTasks } = req.body;

    // Validate requiredTasks is an array of objects with task and notes
    if (!Array.isArray(requiredTasks) || requiredTasks.length === 0) {
        return next(new AppError('At least one required task is required', 400));
    }
    for (const row of requiredTasks) {
        if (!row.task) {
            return next(new AppError('Each required task must have a task name', 400));
        }
    }
    // Validate that all required tasks exist in the task options
    const taskNames = requiredTasks.map(row => row.task);
    const validTaskOptions = await TaskOption.find({
        isActive: true,
        name: { $in: taskNames }
    });
    if (validTaskOptions.length !== taskNames.length) {
        const validTaskNames = validTaskOptions.map(task => task.name);
        const invalidTasks = taskNames.filter(task => !validTaskNames.includes(task));
        return next(new AppError(`Invalid task options: ${invalidTasks.join(', ')}`, 400));
    }
    const newVisitType = await VisitType.create({
        ...req.body,
        clientId
    });
    // Log activity
    const client = await Client.findById(clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Visit type added',
            user: 'Admin',
        });
    }
    res.status(201).json({
        status: 'success',
        data: {
            visitType: newVisitType
        }
    });
});

// Update a visit type
exports.updateVisitType = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { requiredTasks } = req.body;
    // Validate requiredTasks is an array of objects with task and notes
    if (!Array.isArray(requiredTasks) || requiredTasks.length === 0) {
        return next(new AppError('At least one required task is required', 400));
    }
    for (const row of requiredTasks) {
        if (!row.task) {
            return next(new AppError('Each required task must have a task name', 400));
        }
    }
    // Validate that all required tasks exist in the task options
    const taskNames = requiredTasks.map(row => row.task);
    const validTaskOptions = await TaskOption.find({
        isActive: true,
        name: { $in: taskNames }
    });
    if (validTaskOptions.length !== taskNames.length) {
        const validTaskNames = validTaskOptions.map(task => task.name);
        const invalidTasks = taskNames.filter(task => !validTaskNames.includes(task));
        return next(new AppError(`Invalid task options: ${invalidTasks.join(', ')}`, 400));
    }
    const visitType = await VisitType.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
    if (!visitType) {
        return next(new AppError('Visit type not found', 404));
    }
    // Log activity
    const client = await Client.findById(visitType.clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Visit type updated',
            user: 'Admin',
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            visitType
        }
    });
});

// Delete a visit type (soft delete)
exports.deleteVisitType = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const visitType = await VisitType.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!visitType) {
        return next(new AppError('Visit type not found', 404));
    }

    // Log activity
    const client = await Client.findById(visitType.clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Visit type deleted',
            user: 'Admin',
        });
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});

// Restore a deleted visit type
exports.restoreVisitType = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const visitType = await VisitType.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
    );

    if (!visitType) {
        return next(new AppError('Visit type not found', 404));
    }

    // Log activity
    const client = await Client.findById(visitType.clientId);
    if (client) {
        ActivityLog.create({
            client: client._id,
            action: 'Visit type restored',
            user: 'Admin',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            visitType
        }
    });
});

// Get all required task options (for dropdown)
exports.getRequiredTaskOptions = catchAsync(async (req, res, next) => {
    console.log('getRequiredTaskOptions called');

    // Get task options from database
    const taskOptions = await TaskOption.find({ isActive: true }).sort({ name: 1 });
    const requiredTasks = taskOptions.map(task => task.name);

    // If no task options exist, create default ones
    if (requiredTasks.length === 0) {
        const defaultTasks = [
            'Medication',
            'Body Map',
            'Food',
            'Drinks',
            'Personal Care',
            'Toilet Assistance',
            'Repositioning',
            'Companionship/Respite Care',
            'Laundry',
            'Groceries',
            'House work',
            'Household Chores',
            'Incident Response'
        ];

        // Create default task options
        await TaskOption.insertMany(
            defaultTasks.map(name => ({ name }))
        );

        requiredTasks.push(...defaultTasks);
    }

    console.log('Required tasks:', requiredTasks);

    res.status(200).json({
        status: 'success',
        data: {
            requiredTasks
        }
    });
});

// Add new task option
exports.addNewTaskOption = catchAsync(async (req, res, next) => {
    const { taskOption } = req.body;

    if (!taskOption || !taskOption.trim()) {
        return next(new AppError('Task option is required', 400));
    }

    const trimmedTaskOption = taskOption.trim();

    // Check if task option already exists
    const existingTask = await TaskOption.findOne({
        name: { $regex: new RegExp(`^${trimmedTaskOption}$`, 'i') }
    });

    if (existingTask) {
        return next(new AppError('Task option already exists', 400));
    }

    // Create new task option
    const newTaskOption = await TaskOption.create({
        name: trimmedTaskOption
    });

    console.log('Added new task option:', newTaskOption.name);

    res.status(201).json({
        status: 'success',
        data: {
            taskOption: newTaskOption.name
        }
    });
});

// Delete a task option
exports.deleteTaskOption = catchAsync(async (req, res, next) => {
    const { taskOptionName } = req.params;

    // Check if the task option is being used by any visit types
    const visitTypesUsingTask = await VisitType.find({
        requiredTasks: taskOptionName,
        isActive: true
    });

    if (visitTypesUsingTask.length > 0) {
        const clientIds = [...new Set(visitTypesUsingTask.map(vt => vt.clientId))];
        return next(new AppError(
            `Cannot delete task option "${taskOptionName}" as it is being used by ${visitTypesUsingTask.length} visit type(s). Please remove it from all visit types first.`,
            400
        ));
    }

    const taskOption = await TaskOption.findOneAndUpdate(
        { name: taskOptionName, isActive: true },
        { isActive: false },
        { new: true }
    );

    if (!taskOption) {
        return next(new AppError('Task option not found', 404));
    }

    console.log('Deleted task option:', taskOption.name);

    res.status(200).json({
        status: 'success',
        data: null
    });
}); 