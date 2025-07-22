const express = require('express');
const clientController = require('./../controllers/clientController')
const { validateClient } = require('../validators/clientValidator');
const validate = require('../middlewares/validateResult');
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

const router = express.Router();


router.get('/check-id', clientController.checkClientId);

router.route('/')
    .get(clientController.getClients)
    .post(validateClient, validate, clientController.createClient);




router.route('/:id')
    .get(clientController.getClient)
    .patch(clientController.updateClient)
    .delete(clientController.deleteClient);

router
    .route('/:id/archive')
    .patch(clientController.archiveClient);
router
    .route('/:id/unarchive')
    .patch(clientController.unarchiveClient);

router.route('/:id/documents')
    .get(clientController.getDocuments)
    .post(clientController.addDocument);

router.route('/:id/documents/:documentId')
    .patch(clientController.updateDocument)
    .delete(clientController.deleteDocument);

router.post('/:id/documents/attachment', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl, originalName: req.file.originalname });
});

module.exports = router;