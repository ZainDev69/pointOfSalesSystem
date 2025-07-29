const CarePlanDocument = require('../models/carePlanDocumentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ActivityLog = require('../models/activityLogModel');
const path = require('path');
const multer = require('multer');


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



exports.getAllDocumentsForClient = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;
    const docs = await CarePlanDocument.find({ clientId });
    res.status(200).json({ status: 'Success', data: docs });
});

exports.addDocumentForClient = catchAsync(async (req, res, next) => {
    const { clientId } = req.params;
    const doc = await CarePlanDocument.create({ ...req.body, clientId });
    // Log to client activity log
    await ActivityLog.create({
        client: clientId,
        action: `Client Document added: ${doc.title}`,
        user: 'Admin',
    });
    res.status(201).json({ status: 'Success', data: doc });
});

exports.updateDocumentForClient = catchAsync(async (req, res, next) => {
    const { clientId, docId } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;
    const doc = await CarePlanDocument.findOneAndUpdate(
        { _id: docId, clientId },
        updateData,
        { new: true }
    );
    if (!doc) return next(new AppError('Document not found', 404));
    // Log to client activity log
    await ActivityLog.create({
        client: clientId,
        action: `Client Document updated: ${doc.title}`,
        user: 'Admin',
    });
    res.status(200).json({ status: 'Success', data: doc });
});

exports.deleteDocumentForClient = catchAsync(async (req, res, next) => {
    const { clientId, docId } = req.params;
    const doc = await CarePlanDocument.findOneAndDelete({ _id: docId, clientId });
    if (!doc) return next(new AppError('Document not found', 404));
    // Log to client activity log
    await ActivityLog.create({
        client: clientId,
        action: `Client Document deleted: ${doc.title}`,
        user: 'Admin',
    });
    res.status(204).json({ status: 'Success', data: null });
});






exports.uploadAttachmentHandler = catchAsync(async (req, res, next) => {
    console.log("Uploading attachment", req.file);
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl, originalName: req.file.originalname });
});




