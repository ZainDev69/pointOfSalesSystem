const Document = require('../models/documentModel');
const { Client } = require('../models/clientModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ActivityLog = require('../models/activityLogModel');

// Get all documents for a client
exports.getDocuments = catchAsync(async (req, res, next) => {
    const { clientId } = req.query;
    if (!clientId) return next(new AppError('clientId query param required', 400));
    const documents = await Document.find({ clientId });
    res.status(200).json({ status: 'Success', data: documents });
});

// Add a document
exports.addDocument = catchAsync(async (req, res, next) => {
    const { clientId } = req.body;
    if (!clientId) return next(new AppError('clientId required in body', 400));
    const document = await Document.create(req.body);
    await ActivityLog.create({ client: clientId, action: `Document added: ${document.title}`, user: 'Admin' });
    res.status(201).json({ status: 'Success', data: document });
});

// Update a document
exports.updateDocument = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Document.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) return next(new AppError('Document not found', 404));
    await ActivityLog.create({ client: document.clientId, action: `Document updated: ${document.title}`, user: 'Admin' });
    res.status(200).json({ status: 'Success', data: document });
});

// Delete a document
exports.deleteDocument = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Document.findByIdAndDelete(id);
    if (!document) return next(new AppError('Document not found', 404));
    await ActivityLog.create({ client: document.clientId, action: `Document deleted: ${document.title}`, user: 'Admin' });
    res.status(204).json({ status: 'Success', data: null });
});

// Upload an attachment (to be used in the route with multer)
exports.uploadAttachment = catchAsync(async (req, res, next) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl, originalName: req.file.originalname });
}); 