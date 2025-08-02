const { Client } = require('./../models/clientModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Contact = require('../models/contactModel');
const CarePlan = require('../models/carePlanModel');
const Outcome = require('../models/outcomeModel');
const ActivityLog = require('../models/activityLogModel');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, base + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });

exports.getClientOptions = catchAsync(async (req, res, next) => {
    const options = {
        title: Client.schema.path('personalDetails.title').enumValues,
        gender: Client.schema.path('personalDetails.gender').enumValues,
        relationshipStatus: Client.schema.path('personalDetails.relationshipStatus').enumValues,
        ethnicity: Client.schema.path('personalDetails.ethnicity').enumValues,
        status: Client.schema.path('status').enumValues,
        preferredContactMethod: Client.schema.path('contactInformation.preferredContactMethod').enumValues,
        conditionSeverity: Client.schema.path('medicalInformation.conditions.0.severity').enumValues,
        conditionStatus: Client.schema.path('medicalInformation.conditions.0.status').enumValues,
        allergySeverity: Client.schema.path('medicalInformation.allergies.0.severity').enumValues,
        medicationRoute: Client.schema.path('medicalInformation.medications.0.route').enumValues,
        medicationStatus: Client.schema.path('medicalInformation.medications.0.status').enumValues,
        religiousPracticeLevel: Client.schema.path('preferences.religious.practiceLevel').enumValues,
        dietaryAssistanceLevel: Client.schema.path('preferences.dietary.assistanceLevel').enumValues,
    };

    res.status(200).json({
        status: 'Success',
        data: options,
    });
});



exports.createClient = catchAsync(async (req, res, next) => {

    // Set start date to current date if not provided
    const clientData = {
        ...req.body,
        startDate: req.body.startDate || new Date(),
    };

    // Calculate review date as 6 months after start date
    const startDate = new Date(clientData.startDate);
    const reviewDate = new Date(startDate);
    reviewDate.setMonth(reviewDate.getMonth() + 6);
    clientData.reviewDate = reviewDate;

    const newClient = await Client.create(clientData);
    res.status(201).json({
        status: 'Success',
        data: {
            client: newClient
        }
    });
});


exports.getClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const client = await Client.findById(id);
    if (!client) return next(new AppError(`No Client found with that ID`, 404));
    res.status(200).json({
        status: 'Success',
        data: client
    });

})


exports.getClients = catchAsync(async (req, res, next) => {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['sort', 'page', 'limit'];
    excludeFields.forEach(el => delete queryObj[el]);

    // For filtering by nested fields like personalDetails.fullName
    let mongoQuery = {};
    if (queryObj.fullName) {
        mongoQuery['personalDetails.fullName'] = { $regex: queryObj.fullName, $options: 'i' };
        delete queryObj.fullName;
    }
    if (queryObj.status) {
        mongoQuery['status'] = queryObj.status;
        delete queryObj.status;
    }
    // Add any other direct filters
    Object.assign(mongoQuery, queryObj);

    let query = Client.find(mongoQuery);

    // Sorting
    if (req.query.sort) {
        query = query.sort(req.query.sort.split(',').join(' '));
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const clients = await query;
    const total = await Client.countDocuments(mongoQuery);

    res.status(200).json({
        status: 'Success',
        results: clients.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: clients
    });
})


exports.updateClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const oldClient = await Client.findById(id);
    if (!oldClient) return next(new AppError('No Client found with that ID', 404));

    // Merge nested objects
    const updateData = { ...req.body };
    for (const key of Object.keys(req.body)) {
        if (typeof req.body[key] === 'object' && req.body[key] !== null && oldClient[key]) {
            updateData[key] = { ...oldClient[key]._doc, ...req.body[key] };
        }
    }

    // Calculate new review date as 6 months from current date when client is updated
    const currentDate = new Date();
    const newReviewDate = new Date(currentDate);
    newReviewDate.setMonth(newReviewDate.getMonth() + 6);
    updateData.reviewDate = newReviewDate;

    // I removed runValidators: true because it was causing the validation errors
    const client = await Client.findByIdAndUpdate(id, updateData, { new: true });

    if (client) {
        // High-level change detection
        let section = null;
        for (const key of Object.keys(req.body)) {
            if (typeof req.body[key] === 'object' && req.body[key] !== null && oldClient[key]) {
                for (const subKey of Object.keys(req.body[key])) {
                    if (JSON.stringify(req.body[key][subKey]) !== JSON.stringify(oldClient[key][subKey])) {
                        section = key;
                        break;
                    }
                }
            } else {
                if (JSON.stringify(req.body[key]) !== JSON.stringify(oldClient[key])) {
                    section = key;
                    break;
                }
            }
            if (section) break;
        }
      
        let actionMsg = 'Updated client';
        if (section) {
            switch (section) {
                case 'personalDetails':
                    actionMsg = 'Personal details updated'; break;
                case 'addressInformation':
                    actionMsg = 'Address information updated'; break;
                case 'contactInformation':
                    actionMsg = 'Contact information updated'; break;
                case 'nextOfKin':
                    actionMsg = 'Next of kin updated'; break;
                case 'consent':
                    actionMsg = 'Consent updated'; break;
                case 'healthcareContacts':
                    actionMsg = 'Healthcare contacts updated'; break;
                case 'medicalInformation':
                    actionMsg = 'Medical information updated'; break;
                case 'preferences':
                    actionMsg = 'Preferences updated'; break;
                case 'Archived':
                    actionMsg = 'Archive status updated'; break;
                case 'carePlan':
                    actionMsg = 'Care plan updated'; break;
                default:
                    actionMsg = `${section.charAt(0).toUpperCase() + section.slice(1)} updated`;
            }
        }
        await ActivityLog.create({ client: client._id, action: actionMsg, user: 'Admin' });
    }
    
    res.status(200).json({
        status: 'Success',
        data: {
            client
        }
    })
})


exports.deleteClient = catchAsync(async (req, res, next) => {
    const client = await Client.findById(req.params.id);
    if (!client) return next(new AppError(`No client found with that ID`, 404));
    // Log activity (not needed for client delete, as discussed)
    await client.save();
    // Cascade delete related contacts, care plans, and outcomes
    await Contact.deleteMany({ client: client._id });
    await CarePlan.deleteMany({ clientId: client._id });
    await Outcome.deleteMany({ clientId: client._id });
    await Client.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'Success',
        data: 'Client deleted Successfully'
    });
})


exports.archiveClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const oldClient = await Client.findById(id);
    const client = await Client.findByIdAndUpdate(
        id,
        { Archived: true },
        { new: true, runValidators: true }
    );

    if (!client) return next(new AppError('No Client found with that ID', 404));
    await ActivityLog.create({ client: client._id, action: `Archived client: Archived: '${oldClient?.Archived}' → 'true'`, user: 'Admin' });
    await client.save();

    res.status(200).json({
        status: 'Success',
        data: client
    });
});


exports.unarchiveClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const oldClient = await Client.findById(id);
    const client = await Client.findByIdAndUpdate(
        id,
        { Archived: false },
        { new: true, runValidators: true }
    );

    if (!client) return next(new AppError('No Client found with that ID', 404));
    await ActivityLog.create({ client: client._id, action: `Unarchived client: Archived: '${oldClient?.Archived}' → 'false'`, user: 'Admin' });
    await client.save();

    res.status(200).json({
        status: 'Success',
        data: client
    });
});

exports.checkClientId = catchAsync(async (req, res, next) => {
    const { clientId } = req.query;
    if (!clientId) {
        return res.status(400).json({ status: 'Fail', message: 'clientId query param required' });
    }
    const clients = await Client.find({ ClientID: clientId });
    res.status(200).json({ status: 'Success', data: clients });
});

// Upload or update client photo
exports.uploadClientPhoto = [
    upload.single('photo'),
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const client = await Client.findById(id);
        if (!client) return next(new AppError('No Client found with that ID', 404));
        if (req.file) {
            client.photo = `/uploads/${req.file.filename}`;
            await client.save();
        }
        res.status(200).json({ status: 'Success', data: client });
    })
];






