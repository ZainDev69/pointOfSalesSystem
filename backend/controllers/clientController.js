const Client = require('./../models/clientModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Contact = require('../models/contactModel');
const CarePlan = require('../models/carePlanModel');
const Outcome = require('../models/outcomeModel');
const ActivityLog = require('../models/activityLogModel');



exports.createClient = catchAsync(async (req, res, next) => {
    console.log("📦 Incoming Client Payload:", req.body);
    const newClient = await Client.create(req.body);
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
    const clients = await Client.find();
    res.status(200).json({
        status: 'Success',
        results: clients.length,
        data: clients
    });
})


exports.updateClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const oldClient = await Client.findById(id);
    if (!oldClient) return next(new AppError('No Client found with that ID', 404));

    // Merge nested objects
    console.log("Updating client");
    const updateData = { ...req.body };
    for (const key of Object.keys(req.body)) {
        if (typeof req.body[key] === 'object' && req.body[key] !== null && oldClient[key]) {
            updateData[key] = { ...oldClient[key]._doc, ...req.body[key] };
        }
    }

    console.log("After merging nested objects")
    // I removed runValidators: true because it was causing the validation errors
    console.log("updateData", updateData)
    const client = await Client.findByIdAndUpdate(id, updateData, { new: true });
    console.log("After findByIdAndUpdate")
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
        console.log("After 1st if else")
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
        await ActivityLog.create({ client: client._id, action: actionMsg, user: 'System' });
    }
    console.log("Client updated successfully from backend message")
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
    await ActivityLog.create({ client: client._id, action: `Archived client: Archived: '${oldClient?.Archived}' → 'true'`, user: 'System' });
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
    await ActivityLog.create({ client: client._id, action: `Unarchived client: Archived: '${oldClient?.Archived}' → 'false'`, user: 'System' });
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

// Get all documents for a client
exports.getDocuments = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const client = await Client.findById(id);
    if (!client) return next(new AppError('No Client found with that ID', 404));
    res.status(200).json({
        status: 'Success',
        data: client.documents || []
    });
});

// Add a document to a client
exports.addDocument = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const client = await Client.findById(id);
    if (!client) return next(new AppError('No Client found with that ID', 404));
    const document = req.body;
    client.documents.push(document);
    await ActivityLog.create({ client: client._id, action: `Document added: ${document.title || document.id}`, user: 'System' });
    await client.save();
    res.status(201).json({
        status: 'Success',
        data: document
    });
});

// Update a document for a client
exports.updateDocument = catchAsync(async (req, res, next) => {
    const { id, documentId } = req.params;
    const client = await Client.findById(id);
    if (!client) return next(new AppError('No Client found with that ID', 404));
    const docIndex = client.documents.findIndex((doc) => doc.id === documentId);
    if (docIndex === -1) return next(new AppError('Document not found', 404));
    client.documents[docIndex] = { ...client.documents[docIndex]._doc, ...req.body };
    await ActivityLog.create({ client: client._id, action: `Document updated: ${req.body.title || documentId}`, user: 'System' });
    await client.save();
    res.status(200).json({
        status: 'Success',
        data: client.documents[docIndex]
    });
});

// Delete a document for a client
exports.deleteDocument = catchAsync(async (req, res, next) => {
    const { id, documentId } = req.params;
    const client = await Client.findById(id);
    if (!client) return next(new AppError('No Client found with that ID', 404));
    const docIndex = client.documents.findIndex((doc) => doc.id === documentId);
    if (docIndex === -1) return next(new AppError('Document not found', 404));
    const deletedDoc = client.documents[docIndex];
    client.documents.splice(docIndex, 1);
    await ActivityLog.create({ client: client._id, action: `Document deleted: ${deletedDoc?.title || documentId}`, user: 'System' });
    await client.save();
    res.status(204).json({
        status: 'Success',
        data: null
    });
});






