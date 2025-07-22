const CarePlanDocument = require('../models/carePlanDocumentModel');
const CarePlan = require('../models/carePlanModel');
const Client = require('../models/clientModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const path = require('path');
const multer = require('multer');
const ActivityLog = require('../models/activityLogModel');

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

exports.uploadAttachment = upload.single('file');

exports.getDocuments = catchAsync(async (req, res, next) => {
    const { carePlanId } = req.params;
    const docs = await CarePlanDocument.find({ carePlanId });
    res.status(200).json({ status: 'Success', data: docs });
});

exports.addDocument = catchAsync(async (req, res, next) => {
    const { carePlanId } = req.params;
    const doc = await CarePlanDocument.create({ ...req.body, carePlanId });
    // Log to client activity log
    const carePlan = await CarePlan.findById(carePlanId);
    if (carePlan && carePlan.clientId) {
        const client = await Client.findById(carePlan.clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Care Plan Document added: ${doc.title} `,
                user: 'System',
            });
        }
    }
    res.status(201).json({ status: 'Success', data: doc });
});

exports.updateDocument = catchAsync(async (req, res, next) => {
    const { carePlanId, docId } = req.params;
    const doc = await CarePlanDocument.findOneAndUpdate(
        { _id: docId, carePlanId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
    );
    if (!doc) return next(new AppError('Document not found', 404));
    // Log to client activity log
    const carePlan = await CarePlan.findById(carePlanId);
    if (carePlan && carePlan.clientId) {
        const client = await Client.findById(carePlan.clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Care Plan Document updated: ${doc.title} `,
                user: 'System',
            });
        }
    }
    res.status(200).json({ status: 'Success', data: doc });
});

exports.deleteDocument = catchAsync(async (req, res, next) => {
    const { carePlanId, docId } = req.params;
    const doc = await CarePlanDocument.findOneAndDelete({ _id: docId, carePlanId });
    if (!doc) return next(new AppError('Document not found', 404));
    // Log to client activity log
    const carePlan = await CarePlan.findById(carePlanId);
    if (carePlan && carePlan.clientId) {
        const client = await Client.findById(carePlan.clientId);
        if (client) {
            await ActivityLog.create({
                client: client._id,
                action: `Care Plan Document deleted: ${doc.title} `,
                user: 'System',
            });
        }
    }
    res.status(204).json({ status: 'Success', data: null });
});

exports.uploadAttachmentHandler = catchAsync(async (req, res, next) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl, originalName: req.file.originalname });
});

exports.getAllDocumentsForClient = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;
    // Find all care plans for this client
    const carePlans = await CarePlan.find({ clientId });
    const carePlanIds = carePlans.map(cp => cp._id);
    // Find all documents for these care plans
    const docs = await CarePlanDocument.find({ carePlanId: { $in: carePlanIds } });
    res.status(200).json({ status: 'Success', data: docs });
});



